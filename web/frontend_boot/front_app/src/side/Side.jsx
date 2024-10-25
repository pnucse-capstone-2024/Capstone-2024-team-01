import Patient from "./Patient";
import P_Interface from "./interface";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Side = () => {
    const [patients, setPatients] = useState([]);
    const [onepatient, setOnePatient] = useState({});
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [patientPage, setPatientPage] = useState(false)
    const patientsPerPage = 9; // 한 페이지에 표시할 환자 수 (10명)
    
    
    // 서버에서 데이터 1개 가져오기
    const onePatients = async (num) => {
        try {
            const response = await axios.get('http://localhost:8080/api/onepatients', {
                params: { idx: num }
            });
            setOnePatient(response.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    // 환자 선택 시 호출되는 함수
    // 환자 선택 시 호출되는 함수
    const navigateToPatient = async (num) => {
        await onePatients(num); // 데이터를 가져온 후 기다리기
        setPatientPage(true);    // 데이터를 가져온 후 페이지를 전환
    };

    // 서버에서 데이터를 가져오는 함수
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/patients', {
                    params: { number: 1 }
                });
                setPatients(response.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchPatients();
    }, []);

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 현재 페이지에서 표시할 환자 목록 계산
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(patients.length / patientsPerPage);
    const maxPages = Math.min(totalPages, 5); // 최대 페이지 수를 5로 제한

    // 환자 목록을 페이지네이션에 맞게 표시
    const patientList = currentPatients.map((patient, index) => {
        return <Patient key={index} num={patient.people_idx} onButtonClick={navigateToPatient} />;
    });

    // 페이지 버튼을 생성하는 함수
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= maxPages; i++) {
            pageNumbers.push(
                <a
                    key={i}
                    onClick={() => handlePageChange(i)}  // 페이지 변경 함수 호출
                    className={currentPage === i ? 'active' : ''}  // 현재 페이지일 경우 'active' 클래스 추가
                    style={{ fontSize: '10px', margin: '0 3px', cursor: 'pointer' }} // 작은 버튼 크기 설정
                >
                    {i} 
                </a>
            );
        }
        return pageNumbers;  // 생성된 페이지 번호 반환
    };
    return (
      <>
        <div className="sb-nav-fixed">
          <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
              <nav className="sb-sidenav sb-sidenav-dark" id="sidenavAccordion">
                <div className="mb-md-3 text-white">Same disease group</div>
                <div className="sb-sidenav-menu">
                  <div className="nav">
                    <div className="block-patient">
                      {patientList} {/* 환자 목록 표시 */}
                    </div>
                  </div>
                </div>
              </nav>
              <div
                className="pagination-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <a
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  style={{
                    fontSize: "10px",
                    margin: "0 5px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    pointerEvents: currentPage === 1 ? "none" : "auto", // 클릭을 막는 속성 추가
                    opacity: currentPage === 1 ? 0.5 : 1, // 비활성화 시 시각적 표시
                  }}
                >
                  &#10094; {/* 왼쪽 화살표 */}
                </a>
                {renderPageNumbers()}{" "}
                {/* 페이지 번호 버튼을 생성하는 함수 호출 */}
                <a
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  style={{
                    fontSize: "10px",
                    margin: "0 5px",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    pointerEvents: currentPage === totalPages ? "none" : "auto", // 클릭을 막는 속성 추가
                    opacity: currentPage === totalPages ? 0.5 : 1, // 비활성화 시 시각적 표시
                  }}
                >
                  &#10095; {/* 오른쪽 화살표 */}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="navinterface">
          {patientPage && (
            <P_Interface
              id={onepatient.people_idx} // 환자의 id
              onepatient={onepatient}
            />
          )}
        </div>
      </>
    );
};

export default Side;