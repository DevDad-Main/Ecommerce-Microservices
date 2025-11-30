import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "softwaredevdad@gmail.com",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

const sendEmail = async ({
  toEmail,
  subject,
  text,
}: {
  toEmail: string;
  subject: string;
  text: string;
}) => {
  const res = await transporter.sendMail({
    from: '"Oliver Metz" <softwaredevdad@gmail.com>',
    to: toEmail,
    subject,
    text,
  });

  console.log("MESSAGE SENT: ", res);
};

export default sendEmail;
