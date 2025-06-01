const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

/*const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

const sendEmail = async (toEmail, subject, htmlContent) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { name: 'Charity Platform', email: "aahil5074@gmail.com" };
  sendSmtpEmail.to = [{ email: toEmail }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`📧 Email sent to ${toEmail}`);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
};

module.exports = sendEmail;*/
