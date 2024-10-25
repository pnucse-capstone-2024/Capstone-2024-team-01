// Server 작성  
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');


dotenv.config();
const { sequelize } = require('./models');

app.use(express.json());

// CORS 사용

app.use(cors());

// uploads 폴더 생성
try {
  fs.readdirSync("uploads");
} catch (err) {
  // uploads 폴더가 없다면 생성해준다.
  fs.mkdirSync("uploads");
}

var postRouter = require('./routes/post');
app.use('/api', postRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error('데이터베이스 연결 실패:',err);
  });

// API로 요청한 경우 hello 메시지를 보내는 콜백 함수를 넣습니다.
// app.get('/api', (req,res) => {
//   res.send({message:'hello'});
// });



// 서버가 잘 동작하고 있는지 확인
server.listen(8080, ()=>{

  console.log('server is running on 8080');

});

