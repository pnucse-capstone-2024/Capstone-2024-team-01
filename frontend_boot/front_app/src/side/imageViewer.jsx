import React, { useState, useEffect } from 'react';


const ImageViewer = ({ newImage, image_count }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentAxialSlice, setCurrentAxialSlice] = useState(0);
  const [axialSliderPosition, setAxialSliderPosition] = useState(0);
  const [currentCoronalSlice, setCurrentCoronalSlice] = useState(0);
  const [coronalSliderPosition, setCoronalSliderPosition] = useState(0);
  const [currentSagittalSlice, setCurrentSagittalSlice] = useState(0);
  const [sagittalSliderPosition, setSagittalSliderPosition] = useState(0);

  const handleWidth = 20; // 핸들의 너비
  const [sliderWidth, setSliderWidth] = useState(); // 기본값 설정
  
  
  useEffect(() => {
    const updateSliderWidth = () => {
      const sliderContainer = document.querySelector(".slider-container");
      if (sliderContainer) {
        setSliderWidth(sliderContainer.clientWidth ); // 슬라이더 컨테이너의 실제 너비를 가져옵니다.
      }
    };

    // 컴포넌트가 마운트된 후와 창 크기가 변경될 때마다 실행
    updateSliderWidth();
    window.addEventListener('resize', updateSliderWidth);

    return () => {
      window.removeEventListener('resize', updateSliderWidth);
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행


  useEffect(() => {
    const middleSlice = Math.floor(image_count / 2);
    setCurrentAxialSlice(middleSlice);
    setCurrentCoronalSlice(middleSlice);
    setCurrentSagittalSlice(middleSlice);

    // 슬라이더 포지션 계산 (이미지 크기에 맞추기)
    setAxialSliderPosition(
      (middleSlice / (image_count - 1)) * (sliderWidth - handleWidth)
    );
    setCoronalSliderPosition(
      (middleSlice / (image_count - 1)) * (sliderWidth - handleWidth)
    );
    setSagittalSliderPosition(
      (middleSlice / (image_count - 1)) * (sliderWidth - handleWidth)
    );
  }, [image_count, sliderWidth]);

  const changeAxialSlice = (position) => {
    const clampedPosition = Math.max(0, Math.min(position, sliderWidth  - handleWidth));
    const newSliceIndex = Math.round(( (clampedPosition )  / (sliderWidth - handleWidth )) * (image_count - 1))  ;
  
  // 이동 제한 설정 (현재 슬라이스 기준으로 위로 5, 아래로 5)
    const limitedSliceIndex = Math.max(3, Math.min(newSliceIndex -5, clampedPosition ));
    setAxialSliderPosition(clampedPosition);
    setCurrentAxialSlice(limitedSliceIndex);
    
  };

  const changeCoronalSlice = (position) => {
    const clampedPosition = Math.max(0, Math.min(position, sliderWidth - handleWidth));
    const newSliceIndex = Math.round((clampedPosition/ (sliderWidth - handleWidth)) * (image_count - 1));
  
  // 이동 제한 설정 (현재 슬라이스 기준으로 위로 5, 아래로 5)
    const limitedSliceIndex = Math.max(3, Math.min(newSliceIndex-5, clampedPosition));
    setCoronalSliderPosition(clampedPosition);
    setCurrentCoronalSlice(limitedSliceIndex);
  };

  const changeSagittalSlice = (position) => {
    const clampedPosition = Math.max(0, Math.min(position, sliderWidth - handleWidth));
    const newSliceIndex = Math.round((clampedPosition / (sliderWidth - handleWidth)) * (image_count - 1));
  
  // 이동 제한 설정 (현재 슬라이스 기준으로 위로 5, 아래로 5)
    const limitedSliceIndex = Math.max(3, Math.min(newSliceIndex-5, clampedPosition));
    setSagittalSliderPosition(clampedPosition);
    setCurrentSagittalSlice(limitedSliceIndex);
  };

  const handleMouseDown = (event, view) => {
    setIsDragging(true);
    setStartX(event.clientX - (view === 'axial' ? axialSliderPosition : view === 'coronal' ? coronalSliderPosition : sagittalSliderPosition));
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const newSliderPosition = event.clientX - startX;

    // 각 슬라이더의 이동을 처리합니다.
    if (event.target.className.includes("axial-slider")) {
      changeAxialSlice(newSliderPosition);
    } else if (event.target.className.includes("coronal-slider")) {
      changeCoronalSlice(newSliderPosition);
    } else if (event.target.className.includes("sagittal-slider")) {
      changeSagittalSlice(newSliderPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startX]);

  return (
    <div className="image-container">
      {/* Axial 이미지와 슬라이더 */}
      <div className="top-left">
        <img
          src={`${newImage}/axial/slice_${currentAxialSlice}.png`}
          className='image' // Axial 슬라이스 이미지
          alt="Axial Slice"
        />
      
        <div className="slider-container" style={{ marginTop: "7px" }}>
          <div
            className="slider axial-slider"
            style={{
              backgroundColor: "green", // 핸들의 색상 설정
              left: `${axialSliderPosition}px`, // 슬라이더 위치너비에 맞춤

            }}
            onMouseDown={(event) => handleMouseDown(event, 'axial')} // Axial 슬라이더 마우스 다운 이벤트 핸들러
          />
        </div>
      </div>

      {/* Coronal 이미지와 슬라이더 */}
      <div className="bottom-left">
        <img
          src={`${newImage}/coronal/slice_${currentCoronalSlice}.png`} // Coronal 슬라이스 이미지
          className="image"
          alt="Coronal Slice"
        />
        <div className="slider-container" style={{ marginTop: "7px" }}>
          <div
            className="slider coronal-slider"
            style={{
              backgroundColor: "red", // 핸들의 색상 설정
              left: `${coronalSliderPosition}px`, // 슬라이더 위치

            }}
            onMouseDown={(event) => handleMouseDown(event, 'coronal')} // Coronal 슬라이더 마우스 다운 이벤트 핸들러
          />
        </div>
      </div>

      {/* Sagittal 이미지와 슬라이더 */}
      <div className="bottom-right">
        <img
          src={`${newImage}/sagittal/slice_${currentSagittalSlice}.png`} // Sagittal 슬라이스 이미지
          className="image "
          alt="Sagittal Slice"
        />
        <div className="slider-container" style={{ marginTop: "7px" }}>
          <div
            className="slider sagittal-slider"
            style={{
              backgroundColor: "black", // 핸들의 색상 설정
              left: `${sagittalSliderPosition}px`, // 슬라이더 위치
            }}
            onMouseDown={(event) => handleMouseDown(event, 'sagittal')} // Sagittal 슬라이더 마우스 다운 이벤트 핸들러
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;