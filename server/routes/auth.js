const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../modles").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("正在接收一個與auth有關的請求。。。");
  next();
});

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
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
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

module.exports = router;
