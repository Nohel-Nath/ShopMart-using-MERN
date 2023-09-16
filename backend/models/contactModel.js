const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email");
      }
    },
  },

  message: [],
});

// save message
contactSchema.methods.MessageSave = async function (message) {
  try {
    this.message = this.message.concat({ message });
    await this.save();
    return message;
  } catch (error) {
    console.log(error);
  }
};

// create model
const contacts = new mongoose.model("contacts", contactSchema);

module.exports = contacts;
