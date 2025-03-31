import tba from "../../assets/icons/tba01.png";
import bestFifty from "../../assets/icons/b50.png";
import bgOne from "../../assets/images/th6lgkpy.webp";
import bgTwo from "../../assets/images/boujx88f.webp";

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <div
        className="mt-7 container-fluid min-vh-100 d-flex align-items-center"
        style={{
          backgroundImage: `url(${bgOne})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="row align-items-center w-100">
          <div className="col-md-5 my-5 d-flex justify-content-center align-items-center">
            <img
              className="img-fluid"
              src={bestFifty}
              alt="Asia 50 Best Bars"
              style={{ maxWidth: "300px" }}
            />
          </div>
          <div className="col-md-7 d-flex justify-content-center align-items-center">
            <div
              className="py-5 my-3 card d-flex align-items-center"
              style={{ maxWidth: "600px" }}
            >
              <div className="m-3 px-3 lh-lg">
                <h2 className="h1">
                  在日常
                  <br />
                  發現不凡
                </h2>
                <p className="">
                  「Same
                  Old」或許意指熟悉，卻從不意味平凡。這裡的每一杯調酒，都是一場探索與突破的旅程，在看似平靜的日常中，挖掘出意想不到的風味層次。
                  <br />
                  <br />
                  我們榮幸獲選 Taiwan Bar Award 並登上 Asia&apos;s 50 Best Bars
                  這不只是榮耀，更是對我們堅持不懈的鼓勵。我們相信，創新並非打破，而是在經典之上淬鍊出更深層的感動。
                  <br />
                  舉杯之間，與我們一同品味那細膩卻深刻的故事。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="my-5 container-fluid min-vh-100 d-flex align-items-center"
        style={{
          backgroundImage: `url(${bgTwo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="row align-items-center w-100">
          <div className="col-md-7 d-flex justify-content-center align-items-center">
            <div
              className="py-5 my-3 card d-flex align-items-center"
              style={{
                maxWidth: "600px",
                backgroundColor: "black",
                color: "white",
              }}
            >
              <div className="m-3 px-3 lh-lg">
                <h2 className="h1">
                  在細節
                  <br />
                  品味深刻
                </h2>
                <p className="">
                  「Same Old」不只是熟悉，更是無數次細節打磨後的堅持。
                  我們相信，真正的突破不在於推翻，而在於淬鍊經典之美。
                  <br />
                  <br />
                  每一杯調酒，都是一場味覺的探險，
                  與我們一同舉杯，品味那細膩而深遠的故事。
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-5 my-5 d-flex justify-content-center align-items-center">
            <img
              className="img-fluid"
              src={tba}
              alt="Asia 50 Best Bars"
              style={{ maxWidth: "300px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
