const Patient = require("../models/patient");

const selectone = async (req, res, next) => {
    try {
        
        const {idx} = req.query
        const patients = await Patient.findOne({
            where: {
                people_idx: idx // where 옵션을 사용하여 조건 설정
            }
          }); // 모든 환자 데이터를 가져옴
    
        if (patients.length === 0) {
            return res.status(404).json({ message: '환자를 찾을 수 없습니다.' });
        }
        res.json(patients); // 클라이언트에 JSON 형식으로 응답
    } catch (err) {
        console.error('Error fetching patients:', err);
        next(err)
    }
    
};

module.exports = selectone ;