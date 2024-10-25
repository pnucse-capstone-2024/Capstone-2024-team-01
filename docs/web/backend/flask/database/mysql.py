# 모듈 import
import pymysql
from PIL import Image
import base64
from io import BytesIO




class PatService:
    def __init__(self, age, sex, image_file):
        self.sex = sex
        self.age = age
        self.image_file = image_file

    def connection(self):
        db_connection = pymysql.connect(host='127.0.0.1', user='root', password='1234', db='patient', charset='utf8')
        return db_connection
    
    def insert(self):
        db = self.connection()
        cursor = db.cursor()    
    # 이미지 인코딩 insert
        with open("testtime.jpg", "rb") as image_file:
            binary_image = image_file.read()
        #Base64로 인코딩
        binary_image = base64.b64encode(binary_image)
        #UTF-8로 인코딩
        binary_image = binary_image.decode("UTF-8")
        sql = "INSERT INTO people (sex, age, image_data) VALUES(%s, %s, %s)"
        
        cursor.execute(sql, (self.sex, self.age, self.image_file))
        db.commit()

    def select(self, pageNum, count):
        db = self.connection()
        cursor = db.cursor()
        sql =   ''' 
                    select * from people
                    order by num desc
                    limit ? , ?
                '''
        cursor.execute(sql, (pageNum*10, pageNum*10+10))
        return cursor.fetchall()

    def delete(self, idx):
        db = self.connection()
        cursor = db.cursor()
        sql = "DELETE FROM people where people_idx = ?"
        cursor.execute(sql, (idx))
        db.commit()

# db 데이터 가져오기
#cursor.fetchall() #모든 행 가져오기
#cursor.fetchone() # 하나의 행만 가져오기
#cursor.fetchmany() # n개의 데이터 가져오기 

# 수정 사항 db에 저장
#db.commit()
 




# Database 닫기
# db.close()