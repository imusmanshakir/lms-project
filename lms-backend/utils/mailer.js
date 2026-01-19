import nodemailer from "nodemailer";

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS environment variables");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function sendWelcomeEmail(name,email,password,department,degree ) {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to:email,
    subject: "Welcome to LMS 🎓",
    html: `
     <h2>Welcome ${name} 👋</h2>
      <p>You have been added to the LMS.</p>

      <h3>Your Credentials</h3>
      <p><b>Email:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>

      <p><b>Department:</b> ${department}</p>
      <p><b>Degree:</b> ${degree}</p>  <br />   `,
  });

  return info;
}
