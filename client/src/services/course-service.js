import axios from "axios";
const API_URL = "https://react-project9-server.onrender.com/api/course";

class CourseService {
  // 取得token
  getToken() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return user.token || "";
  }

  // 新增課程
  post(title, description, price) {
    const token = this.getToken();
    return axios.post(
      API_URL,
      { title, description, price },
      { headers: { Authorization: token } }
    );
  }

  // 修改課程
  patch(_id, title, description, price) {
    const token = this.getToken();
    return axios.patch(
      API_URL + "/" + _id,
      { title, description, price },
      { headers: { Authorization: token } }
    );
  }

  // 刪除課程
  delete(_id) {
    const token = this.getToken();
    return axios.delete(API_URL + "/" + _id, {
      headers: { Authorization: token },
    });
  }

  // 使用 學生 id，找到學生註冊的課程
  getEnrolledCourse(_id) {
    const token = this.getToken();
    return axios.get(API_URL + "/student/" + _id, {
      headers: { Authorization: token },
    });
  }

  // 使用 講師 id，找到講師擁有的課程
  get(_id) {
    const token = this.getToken();
    return axios.get(API_URL + "/instructor/" + _id, {
      headers: { Authorization: token },
    });
  }

  // 使用 課程名稱，找到課程
  getCourseByName(name) {
    const token = this.getToken();
    return axios.get(API_URL + "/findByName/" + name, {
      headers: { Authorization: token },
    });
  }

  // 找到全部課程
  getAllCourses() {
    const token = this.getToken();
    return axios.get(API_URL, { headers: { Authorization: token } });
  }

  // 註冊課程
  enroll(_id) {
    const token = this.getToken();
    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }

  // (取消)註冊課程
  unEnroll(_id) {
    const token = this.getToken();
    return axios.post(
      API_URL + "/unenroll/" + _id,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }
}

const courseService = new CourseService();

export default courseService;
