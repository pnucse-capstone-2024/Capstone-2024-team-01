import React, { useState, useEffect } from 'react';
import ImageViewer from './imageViewer';
import Output from './output';
import '../css/ImageViewer.css'; // CSS 파일을 임포트합니다.

const P_Interface = ({ id, onepatient }) => {
    const [showPredictions, setShowPredictions] = useState(false); // 예측 이미지 표시 여부
    const [selectedSegmentation, setSelectedSegmentation] = useState('flair'); // 초기값 flair로 설정
    const handleSegmentationChange = (segmentation) => {
        setSelectedSegmentation(segmentation);
    };

    const togglePredictions = () => {
        setShowPredictions(!showPredictions); // 예측 이미지를 토글
    };

    useEffect(() => {
        console.log("Updated onepatient:", onepatient);
    }, [onepatient]);


    return (
      <>
        <div className="user-interface">
          <div className="overlay-container">
            <h6>Patient {id}</h6>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  marginRight: "10px",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Segmenatation
              </div>
              <input
                type="checkbox"
                checked={showPredictions}
                onChange={togglePredictions}
                style={{ width: "40px", height: "20px", cursor: "pointer" }} // 슬라이더 스타일
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <input
                type="radio"
                id="flair"
                name="segmentation"
                value="flair"
                checked={selectedSegmentation === "flair"}
                onChange={() => handleSegmentationChange("flair")}
                style={{ marginRight: "5px", cursor: "pointer" }}
              />
              <label
                htmlFor="flair"
                style={{ marginRight: "15px", fontSize: "13px" }}
              >
                Flair
              </label>

              <input
                type="radio"
                id="t1ce"
                name="segmentation"
                value="t1ce"
                checked={selectedSegmentation === "t1ce"}
                onChange={() => handleSegmentationChange("t1ce")}
                style={{ marginRight: "5px", cursor: "pointer" }}
              />
              <label htmlFor="t1ce" style={{ fontSize: "13px" }}>
                T1ce
              </label>
            </div>
          </div>
          <Output />
        </div>
        <div className="patient-image">
          <ImageViewer
            newImage={
                showPredictions ? 
                    (selectedSegmentation === 'flair' ? onepatient.flair_overlay : onepatient.t1ce_overlay) : 
                    (selectedSegmentation === 'flair' ? onepatient.flair_image : onepatient.t1ce_image)
            }
            image_count={onepatient.new_size}
          />
        </div>
      </>
    );
};

export default P_Interface;