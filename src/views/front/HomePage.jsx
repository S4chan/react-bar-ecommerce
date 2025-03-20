import { useEffect } from "react";
import { Link } from "react-router";
import Marquee from "react-fast-marquee";
import mainImage from "../../assets/images/2c1qr805.png";
import firstImage from "../../assets/images/90x8ll8k.png";
import secondImage from "../../assets/images/g3otuuei.png";
import thirdImage from "../../assets/images/f81x63zl.png";
import logoW from "../../assets/icons/logo-w.png";
import studentDrinkImg from "../../assets/images/rw32uvoi.png";
import tableSoccerImg from "../../assets/images/aahvro9c.png";
import ladiesNightImg from "../../assets/images/ve7qxc9y.png";
import bartenderImg from "../../assets/images/odjrvook.png";
import tba from "../../assets/icons/tba01.png";
import bestFifty from "../../assets/icons/b50.png";
import subImage from "../../assets/images/50yq0ujq.png";

import ReservationForm from "../../components/ReservationForm";
import Introduce from "../../components/Introduce";

import AOS from "aos";
import "aos/dist/aos.css";

export default function HomePage() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <div className="main-image-container container-fluid position-relative">
        <div className="main-image">
          <img src={mainImage} alt="吧檯照片" />
          <div className="bgLogo" data-aos="fade-down">
            <img src={logoW} alt="LOGO" />
            <h1>Same Old, Same Place, Same Drink.</h1>
          </div>
        </div>

        {/* 圓形子圖片 */}
        <div
          className="position-absolute d-none d-xl-block"
          style={{
            top: "50%",
            right: "15%",
            transform: "translateY(-50%)",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          <img
            src={subImage}
            alt="sub visual"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div
            data-aos="fade-right"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
            className="col col-md-4 overlay-item"
          >
            <img src={firstImage} alt="" className="img-fluid custom-img" />
          </div>
          <div
            data-aos="fade-down"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
            className="col col-md-4 overlay-item"
          >
            <img src={secondImage} alt="" className="img-fluid custom-img" />
          </div>
          <div
            data-aos="fade-left"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
            className="col col-md-4 overlay-item"
          >
            <img src={thirdImage} alt="" className="img-fluid custom-img" />
          </div>
        </div>
      </div>

      <div className="bg-light container mt-7 px-4">
        <div className="container-fluid px-0">
          <div className="row py-3 flex-lg-row-reverse align-items-center justify-content-center">
            <div
              className="col-lg-7"
              data-aos="fade-down"
              data-aos-easing="linear"
              data-aos-duration="1500"
            >
              <div className="d-flex flex-column justify-content-center text-lg-start">
                <h2 className=" fw-bold h1">Same Old.</h2>
                <p className="my-3 lh-lg">
                  有些東西，時間流逝，它依然恆久不變，但它從未讓人覺得普通。
                  <br />
                  在這裡，熟悉的舒適感，能讓你放下所有壓力，享受片刻的寧靜，但它又能帶來全新的驚喜和探索。
                  <br />
                  <br />
                  Same
                  Old不僅是一家酒吧，它是一種生活態度、一種對平凡日常的重新定義。
                  <br />
                  我們堅信，即使是最簡單的事物，只要用心，依然能帶來非凡的體驗。
                  <br />
                  這裡，讓你從日常的束縛中釋放出來，體驗每一個細節中蘊藏的美好，讓生活變得更有味道。
                </p>
                <p className="text-center">
                  <small>— EST 2024. —</small>
                </p>
              </div>
            </div>
            <div
              className="col-lg-5 px-1"
              data-aos="fade-up"
              data-aos-easing="linear"
              data-aos-duration="1500"
            >
              <img
                src="src/assets/images/3xyn7soe.png"
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
      <Introduce />
      <div className="about-container mt-7">
        <img
          className="tba"
          src={tba}
          alt="Taiwan Bar Award"
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-back"
          data-aos-delay="500"
          data-aos-offset="0"
        />
        <div className="aboutText">
          <h2>在日常裡，發現不凡</h2>
          <p>
            「Same Old」或許意指熟悉，卻從不意味平凡。
            <br />
            這裡的每一杯調酒，都是一場探索與突破的旅程，在看似平靜的日常中，挖掘出意想不到的風味層次。
            <br />
            <br />
            舉杯之間，與我們一同品味那細膩卻深刻的故事。
          </p>
        </div>
        <img
          className="bestFifty"
          src={bestFifty}
          alt="Asia 50 Best Bars"
          data-aos="fade-zoom-in"
          data-aos-easing="ease-in-back"
          data-aos-delay="500"
          data-aos-offset="0"
        />
      </div>
      <h1 className="my-5 text-center fw-bold" style={{ color: "#e3e3e3" }}>
        活動簡介
      </h1>
      <div className="homeEvent my-5">
        <div className="homeEvent-item imgOne">
          <div
            className="event-bg"
            style={{ backgroundImage: `url(${studentDrinkImg})` }}
          >
            <Link to="/event" className="btn btn-custom">
              查看更多
            </Link>
          </div>
        </div>
        <div className="text-item textOne p-5 d-flex flex-column align-items-start justify-content-around">
          <h2
            style={{
              backgroundColor: "#d72323",
              padding: "0.5rem 1rem 0.5rem 0.25rem",
            }}
          >
            Wed.
          </h2>
          <p>學生暢飲</p>
        </div>
        <div className="homeEvent-item imgTwo">
          <div
            className="event-bg"
            style={{ backgroundImage: `url(${ladiesNightImg})` }}
          >
            <Link to="/event" className="btn btn-custom">
              查看更多
            </Link>
          </div>
        </div>
        <div className="text-item textTwo p-5 d-flex flex-column align-items-start justify-content-around">
          <h2
            style={{
              backgroundColor: "#d72323",
              padding: "0.5rem 1rem 0.5rem 0.25rem",
            }}
          >
            Tue .
          </h2>
          <p>女士之夜</p>
        </div>
        <div className="homeEvent-item imgThree">
          <div
            className="event-bg"
            style={{ backgroundImage: `url(${bartenderImg})` }}
          >
            <Link to="/event" className="btn btn-custom">
              查看更多
            </Link>
          </div>
        </div>
        <div className="text-item textThree p-5 d-flex flex-column align-items-start justify-content-around">
          <h2
            style={{
              backgroundColor: "#d72323",
              padding: "0.5rem 1rem 0.5rem 0.25rem",
            }}
          >
            22nd.
          </h2>
          <p>客座調酒師</p>
        </div>
        <div className="homeEvent-item imgFour">
          <div
            className="event-bg"
            style={{ backgroundImage: `url(${tableSoccerImg})` }}
          >
            <Link to="/event" className="btn btn-custom">
              查看更多
            </Link>
          </div>
        </div>
        <div className="text-item textFour p-5 d-flex flex-column align-items-start justify-content-around ">
          <h2
            style={{
              backgroundColor: "#d72323",
              padding: "0.5rem 1rem 0.5rem 0.25rem",
            }}
          >
            20th Apr.
          </h2>
          <p>桌上足球春季杯</p>
        </div>
      </div>
      <ReservationForm />
      <Marquee
        pauseOnHover
        style={{
          fontSize: "36px",
          backgroundColor: "#d72323",
          color: "#e3e3e3",
          padding: "20px",
          margin: "40px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginRight: "10vw",
          }}
        >
          <i className="bi bi-exclamation-triangle"></i>
          <p>酒後不開車，安全有保障</p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginRight: "10vw",
          }}
        >
          <i className="bi bi-exclamation-triangle"></i>
          <p>酒後找代駕，平安送到家</p>
        </div>
      </Marquee>
    </>
  );
}
