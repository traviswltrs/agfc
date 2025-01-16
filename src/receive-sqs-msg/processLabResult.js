const { parseValue } = require('recordUtils');
const SQL = require('sql-template-strings');
const { postMessageToSnsTopic } = require('snsUtils');


const buildLabResult = (id, record) => {
  return {
    id: id,
    lrAccessionNumber: parseValue(record.NewImage.lrAccessionNumber),
    created: parseValue(record.NewImage.created),
    createdByEmail: parseValue(record.NewImage.createdByEmail),
    modifiedByID: parseValue(record.NewImage.modifiedByID),
    modifiedByEmail: parseValue(record.NewImage.modifiedByEmail),
    modified: parseValue(record.NewImage.modified),
    createdByID: parseValue(record.NewImage.createdByID),
  };
};

const buildLabResultParams = (labResult) => {
  return [
    { name: 'id', value: labResult.id },
    { name: 'accession_number', value: labResult.lrAccessionNumber },
    { name: 'created_date', value: labResult.created },
    { name: 'created_by_email', value: labResult.createdByEmail },
    { name: 'created_by_id', value: labResult.createdByID },
    { name: 'modified_date', value: labResult.modified },
    { name: 'modified_by_email', value: labResult.modifiedByEmail },
    { name: 'modified_by_id', value: labResult.modifiedByID }];
};

const insertLabResult = async (id, record, driver) => {
  const lr = buildLabResult(id, record);

  let sql = SQL`
    INSERT INTO cwd.lab_result(id, lr_accession_number, created, created_by_email, created_by_id,
      modified, modified_by_email, modified_by_id)
      VALUES (:id, :accession_number, :created_date, :created_by_email, :created_by_id, 
        :modified_date, :modified_by_email, :modified_by_id) RETURNING id`.text;

  let parameters = buildLabResultParams(lr);
  const result = await driver.query(sql, parameters);
  return result;
}

const updateDatabaseRecord = async (labResult, driver) => {
  let sql = SQL`
    UPDATE cwd.lab_result SET lr_accession_number = :accession_number,
    created = :created_date, created_by_email = :created_by_email, created_by_id = :created_by_id, 
    modified = :modified_date, modified_by_email = :modified_by_email, modified_by_id = :modified_by_id 
    WHERE id = :id RETURNING id`.text;

  let parameters = buildLabResultParams(labResult);
  const result = await driver.query(sql, parameters);
  return result;
}

const updateLabResult = async (id, record, driver) => {
  const lr = buildLabResult(id, record);
  let recId = null;

  const snsDLQueueArn = process.env.SNS_DL_TOPIC_ARN;

  try {
    let sql = SQL`SELECT count(*) FROM cwd.lab_result WHERE id = :id`.text;
    let parameters = [{ name: 'id', value: id }];
    const res = await driver.query(sql, parameters);
    const count = res[0].count;
    if (count > 0) {
      // update lab result record;
      recId = await updateDatabaseRecord(lr, driver);
    } else {
      // even though we're in an update path, we want to handle the place where a record is out of sync with the database
      // if you update it in dynamo and it doesn't already exist in the replica, this logic will create it.
      recId = await insertLabResult(id, record, driver);
    }
  } catch (err) {
    console.log('Error:', err);
    const messageAsString = JSON.stringify(lr);
    const messagePayload = {
      topicArn: snsDLQueueArn,
      message: messageAsString + ' ' + err,
      subject: "AGFC CWD DB Replication Error - Lab Result"
    }
    await postMessageToSnsTopic(messagePayload);
  }

  if (!recId) {
    console.log('ERROR UPDATING LAB RESULT RECORD!');
    console.log('Id received:', id);
  }

  return recId;
}

// Would only be hit if you went directly to the database
const deleteLabResult = async (id, driver) => {
  let sql = SQL`DELETE FROM cwd.lab_result WHERE id = :id`.text;
  let parameters = [{ name: 'id', value: id }];
  const res = await driver.query(sql, parameters);
  return res;
}


const handleLabResultRequest = async (eventName, id, record, driver) => {
  if (eventName.toUpperCase() === 'INSERT') {
    console.log('LabResult INSERT request received');
    await insertLabResult(id, record, driver);
  } else if (eventName.toUpperCase() === 'MODIFY') {
    console.log('LabResult MODIFY request received');
    await updateLabResult(id, record, driver);
  } else if (eventName.toUpperCase() === 'REMOVE') {
    console.log('LabResult REMOVE request received');
    await deleteLabResult(id, driver);
  }
  return 0;
}


module.exports = { handleLabResultRequest };