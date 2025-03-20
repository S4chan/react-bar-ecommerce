import { useEffect, useState } from "react";

export default function BackToTop() {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滾動效果
    });
  };

  const handleScrolling = () => {
    if (window.scrollY > 500) {
      setShowButton(true); // 顯示按鈕
    } else {
      setShowButton(false); // 隱藏按鈕
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrolling);
    return () => {
      window.removeEventListener("scroll", handleScrolling);
    };
  }, []);

  return (
    <div>
      <button
        className={`back-to-top ${showButton ? "visible" : "hidden"}`}
        onClick={scrollToTop}
      >
        <i className="bi bi-caret-up-fill"></i>
      </button>
    </div>
  );
}
