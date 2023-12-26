import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth-service";

const RegisterComponent = () => {
  const navigate = useNavigate();
  let [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  let [message, setMessage] = useState(null);

  const handlerForm = (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlerRegister = () => {
    AuthService.register(
      formData.username,
      formData.email,
      formData.password,
      formData.role
    )
      .then(() => {
        window.alert("註冊成功。您現在將被導向到登入頁面。");
        navigate("/login", { state: { formDataEmail: formData.email } });
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div>
          <label htmlFor="username">用戶名稱:</label>
          <input
            onChange={handlerForm}
            value={formData.name}
            type="text"
            className="form-control"
            name="username"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">電子信箱：</label>
          <input
            onChange={handlerForm}
            value={formData.email}
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
            value={formData.password}
            type="password"
            className="form-control"
            name="password"
            placeholder="長度至少超過6個英文或數字"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="role">身份：</label>
          <select
            onChange={handlerForm}
            value={formData.role}
            className="form-control"
            name="role"
          >
            <option value=""></option>
            <option value="student">學生</option>
            <option value="instructor">講師</option>
          </select>
        </div>
        <br />
        <button onClick={handlerRegister} className="btn btn-primary">
          <span>註冊會員</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
