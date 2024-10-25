const express = require("express");
const selectp = require('../controller/select')
const selectone = require('../controller/selectone')
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const { Patient } = require('../models'); // 모델 불러오기
const router = express.Router();

// 환자 여러 명 
router.get('/patients', selectp)
// 환자 한명
router.get('/onepatients', selectone)


// Multer 설정: 메모리 저장 방식으로 설정 (파일을 메모리에 버퍼로 저장)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // 'uploads' 디렉토리에 저장
  },
  filename: (req, file, cb) => {
    const fileNameWithoutPrefix = file.originalname.split('_').pop();
    cb(null, fileNameWithoutPrefix); // 파일 이름에 타임스탬프 추가
  }
});

const upload = multer({ storage: storage });

// 파일 업로드 API (POST 요청)
router.post('/addpatient', upload.fields([{ name: 'p_img1' }, { name: 'p_img2' }]), async (req, res) => {
  try {
    const file1Path = req.files['p_img1'][0].path;
    const file2Path = req.files['p_img2'][0].path;


    // 파이썬 서버로 POST 요청 보내기
    const pythonResponse = await axios.post('http://localhost:8000/predict', {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    // 파일 처리 후 삭제
    try {
      fs.unlinkSync(file1Path);
      fs.unlinkSync(file2Path);


    } catch (error) {
      console.error(`파일 삭제 중 오류 발생:`, error);
    }

    // Python 서버 응답 처리
    const { flair_path, t1ce_path, flair_overlay_path, t1ce_overlay_path, new_size} = pythonResponse.data;

    // 환자 데이터베이스에 저장
    const pa = await Patient.create({
        flair_image: flair_path,
        t1ce_image: t1ce_path,
        flair_overlay: flair_overlay_path,
        t1ce_overlay: t1ce_overlay_path,
        new_size: parseInt(new_size, 10),
    });

    res.json({ message: 'Patient created successfully', pa });

  } catch (error) {
    console.error('파일 업로드 실패:', error);
    res.status(500).json({ error: '파일 업로드 중 오류가 발생했습니다.' });
  }
});


module.exports = router;