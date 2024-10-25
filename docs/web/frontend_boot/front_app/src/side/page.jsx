import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pageNumbers = [];

        // 4페이지 이하인 경우 페이지 번호 표시
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => onPageChange(i)}
                        className={currentPage === i ? 'active' : ''}
                        style={{ fontSize: '12px', margin: '0 5px' }} // 숫자 크기 조정
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // 4페이지 이상인 경우 화살표 버튼과 현재 페이지 번호 표시
            pageNumbers.push(
                <button
                    key="prev"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ fontSize: '12px', margin: '0 5px' }} // 숫자 크기 조정
                >
                    &lt;
                </button>
            );

            // 현재 페이지와 양쪽의 페이지 번호 표시
            if (currentPage > 1) {
                pageNumbers.push(
                    <button
                        key={1}
                        onClick={() => onPageChange(1)}
                        style={{ fontSize: '12px', margin: '0 5px' }} // 숫자 크기 조정
                    >
                        1
                    </button>
                );
                if (currentPage > 2) {
                    pageNumbers.push(<span key="ellipsis1">...</span>);
                }
            }

            // 현재 페이지 번호 표시
            pageNumbers.push(
                <button
                    key={currentPage}
                    onClick={() => onPageChange(currentPage)}
                    style={{ fontSize: '12px', margin: '0 5px' }} // 숫자 크기 조정
                >
                    {currentPage}
                </button>
            );

            if (currentPage < totalPages - 1) {
                if (currentPage < totalPages - 2) {
                    pageNumbers.push(<span key="ellipsis2">...</span>);
                }
                pageNumbers.push(
                    <button
                        key={totalPages}
                        onClick={() => onPageChange(totalPages)}
                        style={{ fontSize: '12px', margin: '0 5px' }} // 숫자 크기 조정
                    >
                        {totalPages}
                    </button>
                );
            }

            // 다음 페이지 버튼
            pageNumbers.push(
                <button
                    key="next"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ fontSize: '12px', margin: '0 5px' }} // 숫자 크기 조정
                >
                    &gt;
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="pagination" style={{ textAlign: 'center', marginTop: '20px' }}>
            {renderPageNumbers()}  {/* 페이지네이션 버튼 표시 */}
        </div>
    );
};

export default Pagination;