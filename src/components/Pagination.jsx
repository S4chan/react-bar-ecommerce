import PropTypes from "prop-types";

export default function Pagination({ pageInfo, pageChangeHandler }) {
  const handlePageChange = (e, page) => {
    e.preventDefault();
    pageChangeHandler(page);
  };

  return (
    <div className="d-flex justify-content-center">
      <nav>
        <ul className="pagination">
          <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
            <a
              className="page-link"
              href="#"
              onClick={(e) => handlePageChange(e, pageInfo.current_page - 1)}
            >
              上一頁
            </a>
          </li>

          {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
            <li
              className={`page-item ${
                pageInfo.current_page === index + 1 && "active"
              }`}
              key={index}
            >
              <a
                className="page-link"
                href="#"
                onClick={(e) => handlePageChange(e, index + 1)}
              >
                {index + 1}
              </a>
            </li>
          ))}

          <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
            <a
              className="page-link"
              href="#"
              onClick={(e) => handlePageChange(e, pageInfo.current_page + 1)}
            >
              下一頁
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

Pagination.propTypes = {
  pageInfo: PropTypes.shape({
    has_pre: PropTypes.bool,
    current_page: PropTypes.number,
    total_pages: PropTypes.number,
    has_next: PropTypes.bool,
  }),
  pageChangeHandler: PropTypes.func,
};
