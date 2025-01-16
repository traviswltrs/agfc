const { parseValue } = require('recordUtils');
const SQL = require('sql-template-strings');
const { postMessageToSnsTopic } = require('snsUtils');

/**
 * The lab submission object coming from dynamo is complicated.  When you save a new lab submission with say 2 cwd sample ids, you get 3 dynamo records.
 * The way you know which is the parent and which are the children is by looking at the sortKey.  The parent has a sortKey value where the id is the same 
 * as the id in the id field.  The children records pass the cwdSampleId value in the sortKey field.  The id field is the same as the id in the parent record.
 * @param {string} id 
 * @param {*} record 
 * @returns 
 */
const buildLabSubmissionParent = (id, record) => {
  return {
    id: id,
    lsDateShipped: parseValue(record.NewImage.lsDateShipped),
    lsLaboratory: parseValue(record.NewImage.lsLaboratory),
    lsTrackingNumber: parseValue(record.NewImage.lsTrackingNumber),
    lsTrayNumber: parseValue(record.NewImage.lsTrayNumber),
    createdByID: parseValue(record.NewImage.createdByID),
    createdByEmail: parseValue(record.NewImage.createdByEmail),
    created: parseValue(record.NewImage.created),
    modifiedByID: parseValue(record.NewImage.modifiedByID),
    modifiedByEmail: parseValue(record.NewImage.modifiedByEmail),
    modified: parseValue(record.NewImage.modified)
  };
};

const buildLabSubmissionChild = (id, cwdSampleId, record) => {
  return {
    labSubmissionId: id,
    cwdSampleId: cwdSampleId,
    createdByID: parseValue(record.NewImage.createdByID),
    createdByEmail: parseValue(record.NewImage.createdByEmail),
    created: parseValue(record.NewImage.created),
    modifiedByID: parseValue(record.NewImage.modifiedByID),
    modifiedByEmail: parseValue(record.NewImage.modifiedByEmail),
    modified: parseValue(record.NewImage.modified)
  };
};

const buildLabSubmissionParams = (labSubmission) => {
  return [
    { name: 'id', value: labSubmission.id },
    { name: 'date_shipped', value: labSubmission.lsDateShipped },
    { name: 'lab', value: labSubmission.lsLaboratory },
    { name: 'tracking_num', value: labSubmission.lsTrackingNumber },
    { name: 'tray_num', value: labSubmission.lsTrayNumber },
    { name: 'created_date', value: labSubmission.created },
    { name: 'created_by_email', value: labSubmission.createdByEmail },
    { name: 'created_by_id', value: labSubmission.createdByID },
    { name: 'modified_date', value: labSubmission.modified },
    { name: 'modified_by_email', value: labSubmission.modifiedByEmail },
    { name: 'modified_by_id', value: labSubmission.modifiedByID }];
};

const buildLabSubmissionChildParams = (labSubmission) => {
  return [
    { name: 'id', value: labSubmission.labSubmissionId },
    { name: 'sample_id', value: labSubmission.cwdSampleId },
    { name: 'created_date', value: labSubmission.created },
    { name: 'created_by_email', value: labSubmission.createdByEmail },
    { name: 'created_by_id', value: labSubmission.createdByID },
    { name: 'modified_date', value: labSubmission.modified },
    { name: 'modified_by_email', value: labSubmission.modifiedByEmail },
    { name: 'modified_by_id', value: labSubmission.modifiedByID }];
};

const insertParentTable = async (labSubmission, driver) => {
  let sql = SQL`
    INSERT INTO cwd.lab_submission(id, ls_date_shipped, ls_laboratory, ls_tracking_number, ls_tray_number, 
      created, created_by_email, created_by_id, modified, modified_by_email, modified_by_id)
      VALUES (:id, :date_shipped, :lab, :tracking_num, :tray_num, :created_date, :created_by_email, :created_by_id, 
        :modified_date, :modified_by_email, :modified_by_id) RETURNING id`.text;

  let parameters = buildLabSubmissionParams(labSubmission);
  const result = await driver.query(sql, parameters);

  return result;
}

const insertChildTable = async (labSubmission, driver) => {
  let sql = SQL`
    INSERT INTO cwd.lab_submission_cwd_sample(lab_submission_id, cwd_sample_id, 
      created, created_by_email, created_by_id, modified, modified_by_email, modified_by_id)
      VALUES (:id, :sample_id, :created_date, :created_by_email, :created_by_id, 
        :modified_date, :modified_by_email, :modified_by_id) RETURNING lab_submission_id`.text;

  let parameters = buildLabSubmissionChildParams(labSubmission);
  const result = await driver.query(sql, parameters);
  return result;
}

const updateParentTable = async (labSubmission, driver) => {
  let result = null;
  const snsDLQueueArn = process.env.SNS_DL_TOPIC_ARN;

  try {
    // first, check to see if the row already exists.  If it does, update it.  If it doesn't, insert it.
    let cntSql = SQL`SELECT count(*) FROM cwd.lab_submission WHERE id = :id`.text;
    const cntParameters = [{ name: 'id', value: labSubmission.id }];
    const cntResult = await driver.query(cntSql, cntParameters);
    const count = cntResult[0].count;

    // The query returns '0' so we use == instead of ===
    if (count == 0) {
      result = await insertParentTable(labSubmission, driver);
    } else {
      let sql = SQL`
        UPDATE cwd.lab_submission 
          SET ls_date_shipped = :date_shipped, ls_laboratory = :lab, ls_tracking_number = :tracking_num, 
              ls_tray_number = :tray_num, created = :created_date, created_by_email = :created_by_email, created_by_id = :created_by_id, 
              modified = :modified_date, modified_by_email = :modified_by_email, modified_by_id = :modified_by_id
        WHERE id = :id RETURNING id`.text;

      let parameters = buildLabSubmissionParams(labSubmission);
      result = await driver.query(sql, parameters);
    }
  } catch (error) {
    console.log('Error updating parent table', error);
    const messageAsString = JSON.stringify(labSubmission);
    const messagePayload = {
      topicArn: snsDLQueueArn,
      message: messageAsString + ' ' + err,
      subject: "AGFC CWD DB Replication Error - Lab Submission Parent"
    }
    await postMessageToSnsTopic(messagePayload);

  }
  return result;
}

const updateChildTable = async (labSubmission, driver) => {
  let result = null;
  const snsDLQueueArn = process.env.SNS_DL_TOPIC_ARN;

  try {
    // first, check to see if the row already exists.  If it does, update it.  If it doesn't, insert it.
    let cntSql = SQL`SELECT count(*) FROM cwd.lab_submission_cwd_sample WHERE lab_submission_id = :id and cwd_sample_id = :sample_id`.text;
    const cntParameters = [{ name: 'id', value: labSubmission.labSubmissionId }, { name: 'sample_id', value: labSubmission.cwdSampleId }];
    const cntResult = await driver.query(cntSql, cntParameters);
    const count = cntResult[0].count;

    // The query returns '0' so we use == instead of ===
    if (count == 0) {
      result = await insertChildTable(labSubmission, driver);
    } else {
      let sql = SQL`
        UPDATE cwd.lab_submission_cwd_sample
          SET created = :created_date, created_by_email = :created_by_email, created_by_id = :created_by_id,
              modified = :modified_date, modified_by_email = :modified_by_email, modified_by_id = :modified_by_id
        WHERE lab_submission_id = :id and cwd_sample_id = :sample_id RETURNING lab_submission_id`.text;

      let parameters = buildLabSubmissionChildParams(labSubmission);
      result = await driver.query(sql, parameters);
    }
  } catch (error) {
    console.log('Error updating child table', error);
    const messageAsString = JSON.stringify(labSubmission);
    const messagePayload = {
      topicArn: snsDLQueueArn,
      message: messageAsString + ' ' + err,
      subject: "AGFC CWD DB Replication Error - Lab Submission Child"
    }
    await postMessageToSnsTopic(messagePayload);
  }
  return result;
}

const insertLabSubmission = async (id, sortKey, record, driver) => {
  const isParent = id === sortKey;
  const ls = isParent ? buildLabSubmissionParent(id, record) : buildLabSubmissionChild(id, sortKey, record);
  if (isParent) {
    await insertParentTable(ls, driver);
  } else {
    await insertChildTable(ls, driver);
  }

  return 0;
}

const updateLabSubmission = async (id, sortKey, record, driver) => {
  const isParent = id === sortKey;
  const ls = isParent ? buildLabSubmissionParent(id, record) : buildLabSubmissionChild(id, sortKey, record);
  if (isParent) {
    await updateParentTable(ls, driver);
  } else {
    await updateChildTable(ls, driver);
  }

  return 0;
}

// Would only be hit if you went directly to the database since our code does a soft delete using cooperatorStatus
const deleteLabSubmission = async (id, sortKey, driver) => {
  const isParent = id === sortKey;

  let sql = isParent ? SQL`DELETE FROM cwd.lab_submission WHERE id = :id`.text : SQL`DELETE FROM cwd.lab_submission_cwd_sample WHERE lab_submission_id = :id AND cwd_sample_id = :sortKey`.text;
  let parameters = isParent ? [{ name: 'id', value: id }] : [{ name: 'id', value: id }, { name: 'sortKey', value: sortKey }];

  const res = await driver.query(sql, parameters);
  return res;
}


const handleLabSubmissionRequest = async (eventName, id, sortKey, record, driver) => {
  if (eventName.toUpperCase() === 'INSERT') {
    console.log('Lab Submission INSERT request received');
    await insertLabSubmission(id, sortKey, record, driver);
  } else if (eventName.toUpperCase() === 'MODIFY') {
    console.log('Lab Submission MODIFY request received');
    await updateLabSubmission(id, sortKey, record, driver);
  } else if (eventName.toUpperCase() === 'REMOVE') {
    console.log('Lab Submission REMOVE request received');
    await deleteLabSubmission(id, sortKey, driver);
  }
  return 0;
}


module.exports = { handleLabSubmissionRequest };