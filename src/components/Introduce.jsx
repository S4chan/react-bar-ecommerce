import supplyOne from "../assets/images/eic6rxpb.webp";
import supplyThree from "../assets/images/yefoj5zo.webp";
import supplyTwo from "../assets/images/1hgu18al.webp";
import facilityOne from "../assets/images/hcbt6vya.webp";
import facilityTwo from "../assets/images/vu6xwcl5.webp";
import facilityThree from "../assets/images/aahvro9c.webp";

export default function Introduce() {
  return (
    <div className="introduce my-5">
      <div className="introduce-container">
        <div className="supplyOne">
          <img src={supplyOne} alt="Get wine" />
        </div>
        <div className="supplyTwo">
          <img src={supplyTwo} alt="Parties" />
        </div>
        <div className="supplyThree">
          <img src={supplyThree} alt="Bartending" />
        </div>
        <div className="supply-text">
          <h2>服務</h2>
          <p className="mt-3">
            無論是與好友共飲一杯精緻調酒、舉辦難忘的生日派對、歡慶勝利的慶功宴，還是觀賞刺激的體育賽事直播，這裡都是最棒的選擇。每一刻，都值得被好好享受。
          </p>
        </div>
        <div className="facility-text">
          <h2>環境</h2>
          <p className=" mt-3">
            提供舒適的包廂空間，讓你擁有專屬的放鬆時光；撞球桌與娛樂設備，則讓夜晚更添趣味。無論獨自前來還是與好友相聚，這裡都有適合你的角落。
          </p>
        </div>
        <div className="facilityOne">
          <img src={facilityOne} alt="Wine Cabinet" />
        </div>
        <div className="facilityTwo">
          <img src={facilityTwo} alt="Pool Table" />
        </div>
        <div className="facilityThree">
          <img src={facilityThree} alt="Table football" />
        </div>
      </div>
    </div>
  );
}
