const Patient = require("../models/patient");

const selectp = async (req, res, next) => {
    try {
        const {number} = req.query
        const patients = await Patient.findAll({
            offset: number-1,
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

module.exports = selectp ;