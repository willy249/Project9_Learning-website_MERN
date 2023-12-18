const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["studer", "instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// instance methods
userSchema.methods.isStuder = function () {
  return this.role === "student";
};

userSchema.methods.isInstructor = function () {
  return this.role === "instructor";
};

userSchema.methods.comparePassword = async function (password, cd) {
  let result = await bcrypt.compare(password, this.password);
  return cd(null, result);
};

// mongoose middleware
// 若使用者為新用戶，或者正在更改密碼，則將密碼進行雜湊處理
userSchema.pre("save", async function (next) {
  // this 代表 mongoDB 内的 document
  if (this.isNew || this.isModified("password")) {
    // 將密碼進行雜湊處理
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
