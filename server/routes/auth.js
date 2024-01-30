const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../modles").user;
const jwt = require("jsonwebtoken");
const passport = require("passport");

// router.use((req, res, next) => {
//   console.log("正在接收一個與auth有關的請求。。。");
//   next();
// });

// 使用者註冊
router.post("/register", async (req, res) => {
  // 驗證數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過。。。");

  // 通過上述兩點後，將資料進行儲存
  let { email, username, password, role } = req.body;
  let newUser = new User({ email, username, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "使用者儲存成功。",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者。。。");
  }
});

// 使用者登入
router.post("/login", async (req, res) => {
  // 驗證數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否存在
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser)
    return res.status(401).send("無法找到使用者。請確認信箱是否正確。");

  // 確認密碼是否正確
  foundUser.comparePassword(req.body.password, (error, isMatch) => {
    if (error) return res.status(500).send(error);

    if (isMatch) {
      // 製作json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_JWTSECRET);
      return res.send({
        message: "登入成功",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

// 使用預設帳號和密碼進行登入
router.post("/quickLogin", async (req, res) => {
  try {
    let { role } = req.body.role;

    // 學生預設帳號
    if (role == "student") {
      // 確認信箱是否存在
      const foundUser = await User.findOne({
        email: process.env.DEFAULT_STUDENT_EMAIL,
      });
      if (!foundUser)
        return res.status(401).send("無法找到使用者。預設帳號已註銷。");

      // 確認密碼是否正確
      foundUser.comparePassword(
        process.env.DEFAULT_STUDENT_PASSWORD,
        (error, isMatch) => {
          if (error) return res.status(500).send(error);

          if (isMatch) {
            // 製作json web token，設定過期時間為 10 分鐘
            const tokenObject = { _id: foundUser._id, email: foundUser.email };
            const token = jwt.sign(
              tokenObject,
              process.env.PASSPORT_JWTSECRET,
              {
                expiresIn: "10m",
              }
            );
            return res.send({
              message: "登入成功",
              token: "JWT " + token,
              user: foundUser,
            });
          } else {
            return res.status(401).send("預設密碼已變更");
          }
        }
      );
    }

    // 使用導師預設帳號和密碼進行登入
    if (role == "instructor") {
      // 確認信箱是否存在
      const foundUser = await User.findOne({
        email: process.env.DEFAULT_INSTRUCTOR_EMAIL,
      });
      if (!foundUser)
        return res.status(401).send("無法找到使用者。預設帳號已註銷。");

      // 確認密碼是否正確
      foundUser.comparePassword(
        process.env.DEFAULT_INSTRUCTOR_PASSWORD,
        (error, isMatch) => {
          if (error) return res.status(500).send(error);

          if (isMatch) {
            // 製作json web token，設定過期時間為 10 分鐘
            const tokenObject = { _id: foundUser._id, email: foundUser.email };
            const token = jwt.sign(
              tokenObject,
              process.env.PASSPORT_JWTSECRET,
              {
                expiresIn: "10m",
              }
            );
            return res.send({
              message: "登入成功",
              token: "JWT " + token,
              user: foundUser,
            });
          } else {
            return res.status(401).send("預設密碼已變更");
          }
        }
      );
    }
  } catch (e) {
    return res.status(500).send("無法使用預設帳號。。。");
  }
});

module.exports = router;
