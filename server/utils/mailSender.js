import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: 'Job-Appliaction || Laxman Yadav',
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent: ", info);
    return info;
  } catch (error) {
    console.log("Mail sending error: ", error.message);
  }
};

export default mailSender;
