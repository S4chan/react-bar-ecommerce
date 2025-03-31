import { useState, useEffect } from "react";
import { Link } from "react-router";
import logoDark from "../assets/icons/logo-d.png";

export default function Footer() {
  const [isActive, setIsActive] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile ? (
        <div className="bg-light container-fluid" style={{ padding: "0" }}>
          <div>
            <form
              className="text-center p-4  w-100"
              style={{ color: "#e3e3e3", backgroundColor: "#d72323" }}
            >
              <h2 className="fw-bold">Subscribe</h2>
              <input
                type="email"
                className="form-control my-3"
                placeholder="E-mail"
              />
              <button
                className="btn"
                style={{ color: "#e3e3e3", backgroundColor: "#303841" }}
              >
                Subscribe
              </button>
            </form>
          </div>
          <div
            className="row text-center py-3 m-0"
            style={{ color: "#303841", backgroundColor: "#e3e3e3" }}
          >
            <div
              className="col-4 mb-3 mb-md-0 d-flex flex-column align-items-center justify-content-around text-break"
              style={{ fontSize: "clamp(0.5rem, 5vw, 1rem)" }}
            >
              <h2 className="fw-bold">Contact</h2>
              <p>sameold2024@gmail.com</p>
              <p>02-5317-414</p>
              <p>台北市信義區松高路6巷88號</p>
            </div>
            <div className="col-4 mb-3 mb-md-0 d-flex flex-column align-items-center justify-content-around">
              <img
                className="img-fluid mb-3"
                src={logoDark}
                alt="logo"
                style={{ maxWidth: "150px" }}
              />
              <div>
                <a
                  href="https://www.facebook.com/"
                  title="Facebook"
                  className="mx-2"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://www.x.com/" title="Twitter" className="mx-2">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a
                  href="https://www.instagram.com"
                  title="Instagram"
                  className="mx-2"
                >
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
            <div
              className="col-4  mb-3 mb-md-0 d-flex flex-column align-items-center justify-content-around text-break"
              style={{ fontSize: "clamp(0.5rem, 5vw, 1rem)" }}
            >
              <h2 className="fw-bold">Service</h2>
              <p>Mon - Fri: 7pm - 2am</p>
              <p>Sat - Sun: 6pm - 2am</p>
              <Link to="/login">後臺登入</Link>
            </div>
          </div>
          <div
            className="copyright"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "#e3e3e3",
              backgroundColor: "#303841",
            }}
          >
            <p className="mb-0">© 2024 Same-Old All Rights Reserved.</p>
          </div>
        </div>
      ) : (
        <div className="footer">
          <div className={`footer-container ${isActive ? "active" : ""}`}>
            <div className="form-container subscribe">
              <form>
                <h1>Subscribe</h1>
                <input type="email" placeholder="Enter E-mail"></input>
                <button>Subscribe</button>
              </form>
            </div>

            <div className="form-container contact">
              <div className="location">
                <h2>Contact</h2>
                <p>sameold2024@gmail.com</p>
                <p>02-5317-414</p>
                <p className="m-0 ">台北市信義區松高路6巷88號</p>
              </div>
              <div className="social-media">
                <img className="contact-logo" src={logoDark} alt="logoDark" />
                <div className="social">
                  <a href="https://www.facebook.com/" title="Facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="https://www.x.com/" title="Twitter">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="https://www.instagram.com" title="Instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                </div>
              </div>
              <div className="service">
                <h2>Service</h2>
                <p>Mon - Fri: 7pm - 2am</p>
                <p>Sat - Sun: 6pm - 2am</p>
                <Link to="/login">後臺登入</Link>
              </div>
            </div>

            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Join the Club?</h1>
                  <p>輸入 e-mail 取得更多資訊</p>
                  <button
                    className="hidden"
                    id="sub"
                    onClick={() => setIsActive(false)}
                  >
                    Subscribe
                  </button>
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>聯絡我們 ?</h1>
                  <p>點擊查看更多</p>
                  <button
                    className="hidden"
                    id="con"
                    onClick={() => setIsActive(true)}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="copyright"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              color: "#e3e3e3",
            }}
          >
            <p className="mb-0">© 2024 Same-Old All Rights Reserved.</p>
          </div>
        </div>
      )}
    </>
  );
}
