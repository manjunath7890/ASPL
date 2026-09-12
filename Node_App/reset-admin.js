const mongoose = require('mongoose');
const User = require('./model/userSchema');
require('dotenv').config();

async function resetPassword() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email: "altenersolutions@gmail.com" });
  if (user) {
    user.password = "password"; // Will be automatically bcrypted by pre-save
    await user.save();
    console.log("Password successfully reset to: password");
  } else {
    console.log("User not found!");
  }
  mongoose.disconnect();
}

resetPassword();
