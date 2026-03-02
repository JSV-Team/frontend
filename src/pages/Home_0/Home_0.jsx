import { useNavigate } from "react-router-dom";
import "./Home_0.css";

export default function Home_0() {
  const navigate = useNavigate();

  return (
    <>  
    <div className="home-wrapper">
      <section className="home-hero">
        <span className="badge">
          ⚡ NỀN TẢNG THỂ THAO SỐ 1 VIỆT NAM
        </span>

        <h1>
          Kết nối đam mê <br />
          <span>thể thao</span>
        </h1>

        <p>
          Tham gia cộng đồng thể thao lớn nhất Việt Nam ngay hôm nay.
        </p>

        <div className="home-actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/register")}
          >
            Đăng ký ngay
          </button>

          <button className="btn-outline">
            Đăng nhập
          </button>
        </div>
      </section>

      <footer className="footer">
        © 2023 SportsApp. All rights reserved.
      </footer>
    </div></>
  );
}