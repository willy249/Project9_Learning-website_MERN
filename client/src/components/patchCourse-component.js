import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CourseService from "../services/course-service";
import useTokenExpiration from "../hooks/useTokenExpiration";

const PatchCourseComponent = ({ currentUser, setCurrentUser }) => {
  // 使用自定義的 Hook，驗證JWT是否過期
  useTokenExpiration(setCurrentUser);

  const location = useLocation();
  const navigate = useNavigate();

  // course-component useNavigate()傳值
  const [courseData, setCourseData] = useState(location?.state?.course || null);

  // courseData僅透過"課程頁面"當中的"修改資料"進行導向和傳值，
  // 若使用者是因刷新patch頁面等操作，導致courseData丟失，則返回於"課程頁面"。
  useEffect(() => {
    if (!courseData && currentUser.user.role == "instructor") {
      navigate("/course");
    }
  }, [courseData]);

  let [formData, setFormData] = useState({
    title: courseData?.title || "",
    description: courseData?.description || "",
    price: courseData?.price || 0,
  });
  let [message, setMessage] = useState("");

  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handlerForm = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlerPatchCourse = () => {
    CourseService.patch(
      courseData._id,
      formData.title,
      formData.description,
      formData.price
    )
      .then(() => {
        window.alert("課程已修改成功");
        navigate("/course");
      })
      .catch((error) => {
        setMessage(error.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>在修改課程之前，您必須先登錄。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            帶我進入登錄頁面。
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "instructor" && (
        <div>
          <h1>只有講師可以修改課程。</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div className="form-group">
          <label htmlFor="exampleforTitle">課程標題：</label>
          <input
            name="title"
            type="text"
            className="form-control"
            id="exampleforTitle"
            onChange={handlerForm}
            value={formData.title}
          />
          <br />
          <label htmlFor="exampleforContent">內容：</label>
          <textarea
            className="form-control"
            id="exampleforContent"
            aria-describedby="emailHelp"
            name="description"
            onChange={handlerForm}
            value={formData.description}
          />
          <br />
          <label htmlFor="exampleforPrice">價格：</label>
          <input
            name="price"
            type="number"
            className="form-control"
            id="exampleforPrice"
            onChange={handlerForm}
            value={formData.price}
          />
          <br />
          <button className="btn btn-primary" onClick={handlerPatchCourse}>
            交出表單
          </button>
          <br />
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatchCourseComponent;
