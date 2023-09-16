const express = require("express");
const contactDb = require("../models/contactModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const nodeMailer = require("nodemailer");

// email config
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
  },
});

//register user details

const contactAdmin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email) {
    return next(new ErrorHandler("Please Enter All The Details", 401));
  }

  try {
    const preUser = await contactDb.findOne({ email: email });

    if (preUser) {
      const userMessage = await preUser.MessageSave(message);
      console.log(userMessage);
      const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: "Sending Message",
        text: "Your Response Has Been Submitted",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error" + error);
        } else {
          console.log("Email sent" + info.response);
          res
            .status(201)
            .json({ status: 201, message: "Message Sent Successfully" });
        }
      });
    } else {
      const finalUser = new contactDb({
        name,
        email,
        message: { message: message },
      });

      const storeData = await finalUser.save();

      const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: "Sending Message",
        text: "Your Response Has Been Submitted",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error" + error);
        } else {
          console.log("Email sent" + info.response);
          res
            .status(201)
            .json({ status: 201, message: "Message sent Successfully" });
        }
      });
      res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    return next(new ErrorHandler("All Input Require", 401));
  }
});

module.exports = {
  contactAdmin,
};
