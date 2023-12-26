import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AuthService from "../services/auth-service";
import { useNavigate } from "react-router-dom";

const useTokenExpiration = (setCurrentUser) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"))?.token || null;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // 檢查是否存在 "exp" 欄位，以及其值是否小於當前時間（已過期）
        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          // JWT 已過期，刪除 localStorage 中的 user 資料
          AuthService.logout(); // 清空 Local storage
          window.alert("JWT 已過期，請重新登入帳號。");
          setCurrentUser(null); // 清空 CurrentUser 資料
          navigate("/login");
        }
      } catch (error) {
        console.error("解析 JWT 過程中發生錯誤", error);
      }
    }
  }, [setCurrentUser]);
};

export default useTokenExpiration;
