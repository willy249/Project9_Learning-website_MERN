import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course-service";
import useTokenExpiration from "../hooks/useTokenExpiration";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  // 使用自定義的 Hook，驗證JWT是否過期
  useTokenExpiration(setCurrentUser);

  const navigate = useNavigate();

  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  let [message, setMessage] = useState(null);
  let [count, setCount] = useState(0);
  let [enrollResult, setEnrollResult] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.user.role == "student") {
      setMessage("");
      setSearchInput("");

      // 確認已註冊課程的清單
      CourseService.getEnrolledCourse(currentUser.user._id)
        .then((data) => {
          setEnrollResult(() => data.data.map((course) => course._id));
        })
        .catch((e) => {
          console.log(e);
        });

      // 查詢全部課程
      CourseService.getAllCourses()
        .then((data) => {
          setSearchResult(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentUser, count]);

  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    if (searchInput) {
      CourseService.getCourseByName(searchInput)
        .then((data) => {
          if (data.data.length !== 0) {
            setSearchResult(data.data);
            setMessage("");
          } else {
            setSearchResult([]);
            setMessage(`找不到符合搜尋字詞「${searchInput}」的課程。`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleSearchAgain = () => {
    setCount(count + 1);
  };
  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then(() => {
        window.alert("課程註冊成功。重新導向到課程頁面。");
        navigate("/course");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登錄才能開始註冊課程。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>請登入學生帳號，查看最新課程。</h1>
        </div>
      )}

      {currentUser && currentUser.user.role == "student" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            value={searchInput}
            type="text"
            className="form-control"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      )}
      {message && (
        <div>
          <div className="alert alert-danger">{message}</div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSearchAgain}
          >
            重新查詢
          </button>
        </div>
      )}

      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          <p>從 API 返回的數據。</p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {searchResult.map((course) => (
              <div
                key={course._id}
                className="card"
                style={{ width: "18rem", margin: "1rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">課程名稱：{course.title}</h5>
                  <p className="card-text" style={{ margin: "0.5rem 0rem" }}>
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>價格: {course.price}</p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    目前的學生人數: {course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師名稱: {course.instructor.username}
                  </p>
                  {!enrollResult.includes(course._id) ? (
                    <a
                      href="#"
                      onClick={handleEnroll}
                      className="card-text btn btn-primary"
                      id={course._id}
                    >
                      註冊課程
                    </a>
                  ) : (
                    <p
                      className="card text-white bg-secondary mb-3 text-center"
                      style={{
                        padding: "0.5rem 0rem",
                        width: "4rem",
                      }}
                    >
                      已註冊
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
