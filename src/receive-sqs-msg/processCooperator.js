const { parseValue } = require('recordUtils');
const SQL = require('sql-template-strings');
const { postMessageToSnsTopic } = require('snsUtils');

const buildCooperator = (id, record) => {
  return {
    id: id,
    cooperatorEmail: parseValue(record.NewImage.cooperatorEmail),
    cooperatorDisplayID: parseValue(record.NewImage.cooperatorDisplayID),
    created: parseValue(record.NewImage.created),
    cooperatorCounty: parseValue(record.NewImage.cooperatorCounty),
    cooperatorStatus: parseValue(record.NewImage.cooperatorStatus),
    cooperatorName: parseValue(record.NewImage.cooperatorName),
    cooperatorType: parseValue(record.NewImage.cooperatorType),
    createdByEmail: parseValue(record.NewImage.createdByEmail),
    cooperatorID: parseValue(record.NewImage.cooperatorID),
    modifiedByID: parseValue(record.NewImage.modifiedByID),
    modifiedByEmail: parseValue(record.NewImage.modifiedByEmail),
    cooperatorPhone: parseValue(record.NewImage.cooperatorPhone),
    modified: parseValue(record.NewImage.modified),
    cooperatorAGFCPointOfContact: parseValue(record.NewImage.cooperatorAGFCPointOfContact),
    cooperatorAddress: parseValue(record.NewImage.cooperatorAddress),
    cooperatorDisplayName: parseValue(record.NewImage.cooperatorDisplayName),
    createdByID: parseValue(record.NewImage.createdByID),
    cooperatorPOCName: parseValue(record.NewImage.cooperatorPOCName)
  };
}

const buildCooperatorParams = (cooperator) => {
  return [
    { name: 'id', value: cooperator.id },
    { name: 'address', value: cooperator.cooperatorAddress },
    { name: 'poc', value: cooperator.cooperatorAGFCPointOfContact },
    { name: 'county', value: cooperator.cooperatorCounty },
    { name: 'display_id', value: cooperator.cooperatorDisplayID },
    { name: 'display_name', value: cooperator.cooperatorDisplayName },
    { name: 'email', value: cooperator.cooperatorEmail },
    { name: 'status', value: cooperator.cooperatorStatus },
    { name: 'contact_name', value: cooperator.cooperatorPOCName },
    { name: 'phone', value: cooperator.cooperatorPhone },
    { name: 'type', value: cooperator.cooperatorType },
    { name: 'created_date', value: cooperator.created },
    { name: 'created_by_email', value: cooperator.createdByEmail },
    { name: 'created_by_id', value: cooperator.createdByID },
    { name: 'modified_date', value: cooperator.modified },
    { name: 'modified_by_email', value: cooperator.modifiedByEmail },
    { name: 'modified_by_id', value: cooperator.modifiedByID }];
}

const insertCooperator = async (id, record, driver) => {
  const cooperator = buildCooperator(id, record);
  let sql = SQL`
    INSERT INTO cwd.cooperator(id, cooperator_address, cooperator_agfc_point_of_contact, cooperator_county,
      cooperator_display_id, cooperator_display_name, cooperator_email, cooperator_status, 
      cooperator_type, cooperator_phone, cooperator_poc_name,
      created, created_by_email, created_by_id,
      modified, modified_by_email, modified_by_id)
      VALUES (:id, :address, :poc, :county, :display_id, :display_name, :email, :status, 
        :type, :phone, :contact_name,
        :created_date, :created_by_email, :created_by_id, 
        :modified_date, :modified_by_email, :modified_by_id) RETURNING id`.text;

  let parameters = buildCooperatorParams(cooperator);
  console.log('Parameters For Inserting Cooperator:', parameters);
  const result = await driver.query(sql, parameters);
  console.log('The result of the insert call:', result);
  return result;
}

const updateDatabaseRecord = async (cooperator, driver) => {
  let sql = SQL`
    UPDATE cwd.cooperator SET cooperator_address = :address, cooperator_agfc_point_of_contact = :poc, cooperator_county = :county,
    cooperator_display_id = :display_id, cooperator_display_name = :display_name, cooperator_email = :email, cooperator_status = :status,
    cooperator_type = :type, cooperator_phone = :phone, cooperator_poc_name = :contact_name,
    created = :created_date, created_by_email = :created_by_email, created_by_id = :created_by_id, 
    modified = :modified_date, modified_by_email = :modified_by_email, modified_by_id = :modified_by_id 
    WHERE id = :id RETURNING id`.text;

  let parameters = buildCooperatorParams(cooperator);
  const result = await driver.query(sql, parameters);
  return result;
}

const updateCooperator = async (id, record, driver) => {
  const cooperator = buildCooperator(id, record);
  let recId = null;

  const snsDLQueueArn = process.env.SNS_DL_TOPIC_ARN;

  try {
    let sql = SQL`SELECT count(*) FROM cwd.cooperator WHERE id = :id`.text;
    let parameters = [{ name: 'id', value: id }];
    const res = await driver.query(sql, parameters);
    const count = res[0].count;
    if (count > 0) {
      console.log('Cooperator record exists in database so going to update it');
      // update Cooperator record;
      recId = await updateDatabaseRecord(cooperator, driver);
    } else {
      console.log('Cooperator record does not exist in database so going to update it');
      // even though we're in an update path, we want to handle the place where a record is out of sync with the database
      // if you update it in dynamo and it doesn't already exist in the replica, this logic will create it.
      recId = await insertCooperator(id, record, driver);
      console.log('Cooperator record inserted:', recId);
    }
  } catch (err) {
    console.log('Error:', err);
    const messageAsString = JSON.stringify(cooperator);
    const messagePayload = {
      topicArn: snsDLQueueArn,
      message: messageAsString + ' ' + err,
      subject: "AGFC CWD DB Replication Error - Cooperator"
    }
    await postMessageToSnsTopic(messagePayload);
  }

  if (!recId) {
    console.log('ERROR UPDATING COOPERATOR RECORD!');
    console.log('Id received:', id);
  }

  return recId;
}

// Would only be hit if you went directly to the database since our code does a soft delete using cooperatorStatus
const deleteCooperator = async (id, driver) => {
  let sql = SQL`DELETE FROM cwd.cooperator WHERE id = :id`.text;
  let parameters = [{ name: 'id', value: id }];
  const res = await driver.query(sql, parameters);
  return res;
}

const handleCooperatorRequest = async (eventName, id, record, driver) => {
  if (eventName.toUpperCase() === 'INSERT') {
    console.log('Cooperator INSERT request received');
    await insertCooperator(id, record, driver);
  } else if (eventName.toUpperCase() === 'MODIFY') {
    console.log('Cooperator MODIFY request received');
    await updateCooperator(id, record, driver);
  } else if (eventName.toUpperCase() === 'REMOVE') {
    console.log('Cooperator REMOVE request received');
    await deleteCooperator(id, driver);
  }
  return 0;
}


module.exports = { handleCooperatorRequest };