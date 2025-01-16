const { processRequestedChange } = require("processRecord");
const { postMessageToSnsTopic } = require('snsUtils');
const { getADriver } = require('databaseDrivers');
const driver = getADriver();
const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
        // loop through records calling an async function for each one
        await Promise.all(event.Records.map(async (record) => {
            const { body } = record;
            const parsedBody = JSON.parse(body);
            const parsedMessage = JSON.parse(parsedBody.Message);
            const updates = parsedMessage || [];
            await Promise.all(updates.map(async (update) => {
                await processRequestedChange(update, driver);
            }));
        }));
    } catch (err) {
        console.log('Handler - Error processing records: ', err);
        // We have try catch handlers in most places around the lower level db calls but in the off chance we fall through somehow to here, we want to catch it and send it to the SNS service.
        const snsDLQueueArn = process.env.SNS_DL_TOPIC_ARN;
        const messagePayload = {
            topicArn: snsDLQueueArn,
            message: JSON.stringify(event),
            subject: "AGFC CWD DB Replication Error - Top Level EP"
        }
        await postMessageToSnsTopic(messagePayload);
    }

    console.log('DB Repl Handler - Just before return success');
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message received' }),
    };
}

module.exports = { handler };