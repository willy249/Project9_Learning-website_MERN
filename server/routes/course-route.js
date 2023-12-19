const router = require("express").Router();
const Course = require("../modles").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("正在接收一個與course有關的請求。。。");
  next();
});

// 課程註冊
router.post("/", async (req, res) => {
  // 驗證數據是否符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認使用者角色(role)
  if (req.user.isStudent) {
    return (
      res.status(400),
      send("只有講師才能發佈新課程。若您已經是講師，請透過講師帳號登入。")
    );
  }

  // 通過上述兩點後，將資料進行儲存
  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let saveCourse = await newCourse.save();
    return res.send({
      message: "新課程已經保存",
      saveCourse,
    });
  } catch (e) {
    return res.status(500).send("無法創建課程。。。");
  }
});

module.exports = router;
