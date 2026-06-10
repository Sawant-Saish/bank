require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"backend" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Our Service!";
  const text = `Hi ${name},\n\nThank you for registering with our service. We're excited to have you on board!\n\nBest regards,\nThe Team`;
  const html = `<p>Hi ${name},</p><p>Thank you for registering with our service. We're excited to have you on board!</p><p>Best regards,<br>The Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(to, amount, fromAccount, toAccount) {
  const subject = "Transaction Successful";
  const text = `Your transaction of ${amount} from account ${fromAccount} to account ${toAccount} was successful.`;
  const html = `<p>Your transaction of <strong>${amount}</strong> from account <strong>${fromAccount}</strong> to account <strong>${toAccount}</strong> was successful.</p>`;

  await sendEmail(to, subject, text, html);
}

async function sendTransactionFailureEmail(to, amount, fromAccount, toAccount) {
  const subject = "Transaction Failed";
  const text = `Your transaction of ${amount} from account ${fromAccount} to account ${toAccount} has failed. Please try again later.`;
  const html = `<p>Your transaction of <strong>${amount}</strong> from account <strong>${fromAccount}</strong> to account <strong>${toAccount}</strong> has failed. Please try again later.</p>`;

  await sendEmail(to, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
