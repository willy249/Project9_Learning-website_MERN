import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course-service";
import useTokenExpiration from "../hooks/useTokenExpiration";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  // 使用自定義的 Hook，驗證JWT是否過期
  useTokenExpiration(setCurrentUser);

  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);

  const handlerTakeToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (currentUser) {
      let _id = currentUser.user._id;

      if (currentUser.user.role === "instructor") {
        CourseService.get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role === "student") {
        CourseService.getEnrolledCourse(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [currentUser]);

  const handlePatchCourse = (course) => {
    navigate("/patchCourse", { state: { course } });
  };

  const handleDeleteCourse = (e) => {
    let _id = e.target.id;

    const isConfirmed = window.confirm("是否確定刪除？");
    if (isConfirmed) {
      CourseService.delete(_id)
        .then((message) => {
          setCourseData((prevCourse) =>
            prevCourse.filter((course) => {
              return course._id !== _id;
            })
          );
          window.alert(message.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const hendlerUnEnroll = (e) => {
    let _id = e.target.id;

    const isConfirmed = window.confirm("是否確定取消課程？");
    if (isConfirmed) {
      CourseService.unEnroll(_id)
        .then((message) => {
          setCourseData((prevCourse) =>
            prevCourse.filter((course) => {
              return course._id !== _id;
            })
          );
          window.alert(message.data);
        })
        .catch((e) => {
          console.log(e.response);
        });
    }
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能看到課程。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handlerTakeToLogin}
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面。</h1>
        </div>
      )}

      {currentUser && currentUser.user.role === "student" && (
        <div>
          <h1>歡迎來到學生的課程頁面。</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div
                key={course._id}
                className="card"
                style={{ width: "18rem", margin: "1rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">課程名稱: {course.title}</h5>
                  <p className="card-text" style={{ margin: "0.5rem 0rem" }}>
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數: {course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格: {course.price}
                  </p>

                  {currentUser.user.role === "instructor" && (
                    <div className="d-grid gap-3 d-md-block">
                      <a
                        href="#"
                        onClick={() => {
                          handlePatchCourse(course);
                        }}
                        className="card-text btn btn-primary"
                        style={{ margin: "1rem 1rem" }}
                      >
                        修改課程
                      </a>
                      <a
                        href="#"
                        onClick={handleDeleteCourse}
                        className="card-text btn btn-danger"
                        style={{ margin: "1rem 1rem" }}
                        id={course._id}
                      >
                        刪除課程
                      </a>
                    </div>
                  )}
                  {currentUser.user.role === "student" && (
                    <a
                      href="#"
                      onClick={hendlerUnEnroll}
                      className="card-text btn btn-danger"
                      id={course._id}
                    >
                      取消課程
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
