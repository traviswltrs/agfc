const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const postMessageToSnsTopic = async (messageConfig) => {
  const client = new SNSClient();
  const input = {
    TopicArn: messageConfig.topicArn,
    Message: messageConfig.message,
    Subject: messageConfig.subject,
    MessageStructure: "STRING_VALUE",
  };
  const command = new PublishCommand(input);
  const response = await client.send(command);
  console.log('response from SNS: ', response);
  return response;
};

module.exports = { postMessageToSnsTopic };

