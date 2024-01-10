import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth-service";

const LoginComponent = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  let [loginFrom, setLoginFrom] = useState({
    email: location?.state?.formDataEmail || "", // register-component useNavigate()傳值
    password: "",
  });
  let [message, setMessage] = useState(null);

  const handlerForm = (e) => {
    let { name, value } = e.target;
    setLoginFrom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlerLogin = async () => {
    try {
      let response = await AuthService.login(
        loginFrom.email,
        loginFrom.password
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功。您現在將被重新導向到個人資料頁面。");
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (e) {
      setMessage(e.response.data);
    }
  };

  const handlerQuickLogin = async (role) => {
    try {
      let response = await AuthService.quickLogin(role);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert(
        "登入成功，10分鐘後帳號將會自動登出。您現在將被重新導向到個人資料頁面。"
      );
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (e) {
      setMessage(e.response.data);
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
          <input
            onChange={handlerForm}
            value={loginFrom.email}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlerForm}
            value={loginFrom.password}
            type="password"
            className="form-control"
            name="password"
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handlerLogin} className="btn btn-primary btn-block">
            <span>登入系統</span>
          </button>
          <button
            onClick={() => handlerQuickLogin({ role: "student" })}
            className="btn btn-link btn-block"
          >
            <span>快速登入學生帳號 (演示用)</span>
          </button>
          <button
            onClick={() => handlerQuickLogin({ role: "instructor" })}
            className="btn btn-link btn-block"
          >
            <span>快速登入講師帳號 (演示用)</span>
          </button>
        </div>
        <div className="alert alert-light mt-2">
          Web Service 部署在 Render
          免費應用，在長時間未使用時會處於休眠狀態，當有請求進來時，
          <span className="fw-bold">
            Render
            會自動喚醒並啟動應用。在休眠期間，首次喚醒可能需要一些時間。。。
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
