import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course-service";
import useTokenExpiration from "../hooks/useTokenExpiration";

const PostCourseComponent = ({ currentUser, setCurrentUser }) => {
  // 使用自定義的 Hook，驗證JWT是否過期
  useTokenExpiration(setCurrentUser);

  let [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
  });
  let [message, setMessage] = useState("");

  const navigate = useNavigate();
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

  const postCourse = () => {
    CourseService.post(formData.title, formData.description, formData.price)
      .then(() => {
        window.alert("新課程已創建成功");
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
          <p>在發布新課程之前，您必須先登錄。</p>
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
          <h1>只有講師可以發布新課程。</h1>
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
          <button className="btn btn-primary" onClick={postCourse}>
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

export default PostCourseComponent;
