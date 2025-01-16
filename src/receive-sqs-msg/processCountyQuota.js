const { parseValue } = require('recordUtils');
const SQL = require('sql-template-strings');
const { postMessageToSnsTopic } = require('snsUtils');

const buildCountyQutoa = (county, season, record) => {
  return {
    county: county,
    season: season,
    quota: parseValue(record.NewImage.countyQuota),
    created: parseValue(record.NewImage.created),
    createdByID: parseValue(record.NewImage.createdByID),
    createdByEmail: parseValue(record.NewImage.createdByEmail),
    modifiedByID: parseValue(record.NewImage.modifiedByID),
    modifiedByEmail: parseValue(record.NewImage.modifiedByEmail),
    modified: parseValue(record.NewImage.modified),
  };
}

const buildCountyQuotaParams = (countyQuota) => {
  return [
    { name: 'county', value: countyQuota.county },
    { name: 'season', value: countyQuota.season },
    { name: 'quota', value: countyQuota.quota },
    { name: 'created_date', value: countyQuota.created },
    { name: 'created_by_email', value: countyQuota.createdByEmail },
    { name: 'created_by_id', value: countyQuota.createdByID },
    { name: 'modified_date', value: countyQuota.modified },
    { name: 'modified_by_email', value: countyQuota.modifiedByEmail },
    { name: 'modified_by_id', value: countyQuota.modifiedByID }];
}

const updateCountyQuota = async (id, sortKey, record, driver) => {
  const countyQuota = buildCountyQutoa(id, sortKey, record);
  let sql = SQL`
    INSERT INTO cwd.county_quota(county, season, quota, 
      created, created_by_email, created_by_id,
      modified, modified_by_email, modified_by_id)
      VALUES (:county, :season, :quota, 
        :created_date, :created_by_email, :created_by_id, 
        :modified_date, :modified_by_email, :modified_by_id) 
      ON CONFLICT(county, season) DO UPDATE 
      SET quota = :quota, modified = :modified_date, modified_by_email = :modified_by_email, modified_by_id = :modified_by_id`.text;

  let parameters = buildCountyQuotaParams(countyQuota);
  try {
    const result = await driver.query(sql, parameters);
    return result;
  } catch (err) {
    console.error('Error add/update county quota:', err);
    const messageAsString = JSON.stringify(countyQuota);
    const messagePayload = {
      topicArn: snsDLQueueArn,
      message: messageAsString + ' ' + err,
      subject: "AGFC CWD DB Replication Error - County Quota"
    }
    await postMessageToSnsTopic(messagePayload);
  }
  return null;
}

// Would only be hit if you went directly to the database since our code does not provide a delete function
const deleteCountyQuota = async (county, season, driver) => {
  let sql = SQL`DELETE FROM cwd.county_quota WHERE county = :county AND season = :season`.text;
  let parameters = [{ name: 'county', value: county }, { name: 'season', value: season }];
  try {
    const res = await driver.query(sql, parameters);
    return res;
  } catch (err) {
    console.error('Error deleting county quota:', err);
    const messageAsString = JSON.stringify({ county, season });
    const messagePayload = {
      topicArn: snsDLQueueArn,
      message: messageAsString + ' ' + err,
      subject: "AGFC CWD DB Replication Error - Delete County Quota"
    }
    await postMessageToSnsTopic(messagePayload);
  }
}

const handleCountyQuotaRequest = async (eventName, id, sortKey, record, driver) => {
  if (eventName.toUpperCase() === 'INSERT') {
    console.log('Cooperator INSERT request received');
    await updateCountyQuota(id, sortKey, record, driver);
  } else if (eventName.toUpperCase() === 'MODIFY') {
    console.log('Cooperator MODIFY request received');
    await updateCountyQuota(id, sortKey, record, driver);
  } else if (eventName.toUpperCase() === 'REMOVE') {
    console.log('Cooperator REMOVE request received');
    await deleteCountyQuota(id, sortKey, driver);
  }
  return 0;
}


module.exports = { handleCountyQuotaRequest };