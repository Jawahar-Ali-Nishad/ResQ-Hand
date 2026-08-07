require("dotenv").config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");
const nodemailer = require("nodemailer");
const cors = require("cors");
const express = require("express");


const app = express();

app.use(cors());
app.use(express.json());
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Define a route to handle the POST request from the frontend
app.post("/send-email", async (req, res) => {
  try {
    const { name, email } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Volunteer Application Accepted - ResQ Hand",
      html: `
        <h2>Congratulations, ${name}! 🎉</h2>

        <p>Your volunteer application has been <b>accepted</b>.</p>

        <p>Your account is now <b>Active</b>.</p>

        <p>Thank you for joining <b>ResQ Hand</b>.</p>

        <br>

        <p>Regards,</p>
        <p><b>ResQ Hand Team</b></p>
      `,
    });

    console.log("✅ Email sent successfully!");

    res.json({
      success: true,
      message: "Email sent successfully!",
    });

  } catch (error) {
    console.error("❌ Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Email could not be sent.",
    });
  }
});
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});