import { Link } from "react-router";
import durnk from "../../assets/images/79b6gxhk.png";

export default function NotFound() {
  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-4">
            <div className="d-flex flex-column justify-content-center text-lg-start">
              <h1 className=" fw-bold h1">喝多了?</h1>
              <h3 className="my-3">門口後方右轉</h3>
              <button className="btn btn-light">
                <Link to="/">回到首頁</Link>
              </button>
            </div>
          </div>
          <div className="col-8">
            <img src={durnk} alt="醉倒" className="img-fluid" />
          </div>
        </div>
      </div>
    </>
  );
}
