const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
});

const sendEmail = async ({ to, subject, html, text }) => {
  const command = new SendEmailCommand({
    Source: "devconnect.support@gmail.com",
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: html,
          Charset: "UTF-8",
        },
        ...(text && {
          Text: {
            Data: text,
            Charset: "UTF-8",
          },
        }),
      },
    },
  });

  return sesClient.send(command);
};

module.exports = { sendEmail };