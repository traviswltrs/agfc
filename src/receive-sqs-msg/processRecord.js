const { handleCooperatorRequest } = require("processCooperator");
const { handleLabSubmissionRequest } = require("processLabSubmission");
const { handleLabResultRequest } = require("processLabResult");
const { handleCwdSampleRequest } = require("processCwdSample");
const { handleCountyQuotaRequest } = require("processCountyQuota");

const parseKey = (key) => {
  // refactored this because the metadata sort keys are coming in as #METADATA#<id> and the other sort keys are coming in as <prefix>#<id>
  const keys = key.split('#');
  const res = keys.length === 3 ? { prefix: keys[1], id: keys[2] } : { prefix: keys[0], id: keys[1] };
  return res;
}

const handleChangeRequest = async (prefix, id, eventName, record, driver) => {
  switch (prefix) {
    case 'COOPERATOR':
      console.log('Cooperator change request received');
      await handleCooperatorRequest(eventName, id, record, driver);
      break;
    case 'LAB_SUBMISSION':
      console.log('Lab submission change request received');
      const sortKey = parseKey(record.Keys.sortKey.S);
      console.log('sortkey is: ', sortKey);
      await handleLabSubmissionRequest(eventName, id, sortKey.id, record, driver);
      break;
    case 'CWD_SAMPLE_RECORD':
      console.log('CWD Sample change request received');
      await handleCwdSampleRequest(eventName, id, record, driver);
      break;
    case 'LAB_RESULT':
      console.log('Lab Result change request received');
      await handleLabResultRequest(eventName, id, record, driver);
      break;
    case 'COUNTY_QUOTA':
      console.log('County Quota request received');
      const cqSortKey = parseKey(record.Keys.sortKey.S);
      await handleCountyQuotaRequest(eventName, id, cqSortKey.id, record, driver);
      break;

    default:
      console.log('Skipping this transaction: ', prefix);
  }
  return 0;
}

const processRequestedChange = async (record, driver) => {
  const { eventName, dynamodb } = record;
  const { prefix, id } = parseKey(dynamodb.Keys.id.S);
  await handleChangeRequest(prefix, id, eventName, dynamodb, driver);
  return 0;
}

module.exports = { processRequestedChange };