import { useState } from "react";
import reservationImg from "../assets/images/tun5vi6w.webp";
import Toast from "../components/Toast";
import { useDispatch } from "react-redux";
import { pushMessage } from "../store/toastSlice";

export default function ReservationForm() {
  const [people, setPeople] = useState("訂位人數");
  const [date, setDate] = useState("2025-03-21");
  const [time, setTime] = useState("");
  const [tel, setTel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const availableTimes = [
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!tel || !time || people === "訂位人數") {
      dispatch(
        pushMessage({
          id: Date.now(),
          status: "danger",
          text: "請填寫完整訂位資訊",
        })
      );
      setIsSubmitting(false);
      return;
    }

    const reservationData = {
      id: Date.now(),
      people,
      date,
      time,
      tel,
    };

    try {
      // 獲取現有的訂位資料
      const existingReservations = JSON.parse(
        localStorage.getItem("reservations") || "[]"
      );

      // 添加新的訂位資料
      existingReservations.push(reservationData);

      // 儲存更新後的訂位資料
      localStorage.setItem(
        "reservations",
        JSON.stringify(existingReservations)
      );

      // 驗證是否成功儲存
      const savedData = localStorage.getItem("reservations");
      if (savedData) {
        dispatch(
          pushMessage({
            id: Date.now(),
            status: "success",
            text: "訂位成功",
          })
        );

        // 清空表單
        setPeople("訂位人數");
        setDate("2025-03-21");
        setTime("");
        setTel("");
      } else {
        throw new Error("資料儲存失敗");
      }
    } catch (error) {
      console.error("Save to localStorage failed:", error);
      dispatch(
        pushMessage({
          id: Date.now(),
          status: "danger",
          text: "訂位失敗",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast />
      <div className="reservation-form">
        <h2>快速訂位</h2>
        <div className="reservation-container">
          {/* 左側表單 */}
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <div>
                <label>人數</label>
                <select
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="訂位人數" disabled>
                    請選擇人數
                  </option>
                  {[...Array(11)].map((_, i) => (
                    <option key={i + 1} value={`${i + 2}位`}>
                      {i + 2} 位
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tel">電話</label>
                <input
                  id="tel"
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder="請輸入電話"
                  className="form-control"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="date">用餐日期</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label>用餐時段</label>
                <div className="time-buttons">
                  {availableTimes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={time === t ? "selected" : ""}
                      onClick={() => setTime(t)}
                      disabled={isSubmitting}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "處理中..." : "送出訂位"}
              </button>
            </form>
          </div>

          {/* 右側圖片 */}
          <div className="image-section">
            <img src={reservationImg} alt="裝飾圖片" />
          </div>
        </div>
      </div>
    </>
  );
}
