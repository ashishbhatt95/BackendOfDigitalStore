// services/otpService.js
const axios = require("axios");
const Otp = require("../models/Otp");

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

async function createAndSendOtp(mobile) {
  const otp = generateOtp();

  // Save OTP in DB with expiry of 5 minutes
  await Otp.create({ mobile, otp, createdAt: new Date() });

  // Message must match DLT template
  const msg = `Your OUR MICROLIFE Login OTP is ${otp}. This is valid for 5 minutes.`;

  // NimbusIT SMS payload
  const payload = {
    UserId: process.env.NIMBUS_USERID,
    Password: process.env.NIMBUS_PASSWORD,
    SenderID: process.env.NIMBUS_SENDERID,
    Phno: mobile,
    Msg: msg,
    EntityID: process.env.NIMBUS_ENTITYID,
    TemplateID: process.env.NIMBUS_TEMPLATEID,
    FlashMsg: 0,
  };

  try {
    await axios.post("http://nimbusit.biz/api/smsapi/SendSms", payload, {
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (err) {
    console.error("SMS sending failed:", err.message);
  }

  return otp;
}

module.exports = { createAndSendOtp };
