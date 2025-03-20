import Marquee from "react-fast-marquee";
import studentDrinkImg from "../../assets/images/rw32uvoi.png";
import tableSoccerImg from "../../assets/images/aahvro9c.png";
import ladiesNightImg from "../../assets/images/ve7qxc9y.png";
import bartenderImg from "../../assets/images/odjrvook.png";

export default function EventPage() {
  const events = [
    {
      id: 1,
      image: studentDrinkImg,
      alt: "學生暢飲",
      category: "學生專屬",
      title: "學生暢飲",
      schedule: "Every Wed.",
      description:
        "課堂之外，開啟你的微醺時光！每週三，學生專屬暢飲優惠，帶上朋友一起舉杯，讓音樂與酒精點燃青春夜晚！",
    },
    {
      id: 2,
      image: ladiesNightImg,
      alt: "女士之夜",
      category: "女士專屬",
      title: "女士之夜",
      schedule: "Every Tue.",
      description:
        "這一夜，妳就是主角！ 每週二 為妳精選特調，舉杯共度迷人夜色，釋放最真實的自己。",
    },
    {
      id: 3,
      image: bartenderImg,
      alt: "客座調酒師之夜",
      category: "限時特調",
      title: "客座調酒師之夜",
      schedule: "Every 22nd.",
      description:
        "一夜限定，獻上獨家風味！ 每月 22日 特邀客座調酒師登場，帶來前所未見的驚喜特調。錯過，只能等下次！",
      titleSize: "display-5",
    },
    {
      id: 4,
      image: tableSoccerImg,
      alt: "桌上足球春季杯",
      category: "競賽活動",
      title: "桌上足球春季杯",
      schedule: "Apr 20th.",
      description:
        "茵場上的熱血，桌上繼續燃燒！ 4 月 20日，集結你的戰友，一起征戰春季桌上足球杯，挑戰榮耀，贏得專屬獎勵！",
      titleSize: "display-5",
    },
  ];

  return (
    <>
      <div className="container-fluid mt-7">
        <div className="container">
          <h1
            className="text-center mb-5 pt-5 fw-bold"
            style={{ color: "#e3e3e3" }}
          >
            活動
          </h1>

          <div className="row g-4 mb-5">
            {events.map((event) => (
              <div key={event.id} className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="row g-0 h-100">
                    <div className="col-md-6">
                      <div className="h-100" style={{ height: "300px" }}>
                        <img
                          src={event.image}
                          className="img-fluid h-100 w-100 object-fit-cover"
                          alt={event.alt}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card-body d-flex flex-column justify-content-center h-100 p-4">
                        <div className="d-flex justify-content-end mb-3">
                          <p className="text-dark mb-0 letter-spacing-1">
                            {event.category}
                          </p>
                        </div>
                        <div
                          className="bg-light my-4"
                          style={{ height: "1px" }}
                        ></div>
                        <h2
                          className={`text-dark mb-4 ${
                            event.titleSize || "display-4"
                          } letter-spacing-1`}
                        >
                          {event.title}
                        </h2>
                        <div className="mt-auto">
                          <p
                            className="text-light mb-2 ps-1 fs-4 fw-bold"
                            style={{ backgroundColor: "red" }}
                          >
                            {event.schedule}
                          </p>
                          <p className="text-dark mb-0 opacity-75">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
          <p>未滿十八歲禁止飲酒。</p>
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
          <p>飲酒過量，害人害己。</p>
        </div>
      </Marquee>
    </>
  );
}
