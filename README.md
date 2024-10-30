### 1. 프로젝트 소개

1.1. 배경 및 필요성

> 최근 MRI 급여화 이후 두통 환자 중 MRI 검사의 수가 크게 증가했습니다. 이는 코로나로 인한 환자 감소의 영향이 있음에도 불구하고 코로나 기간에도 폭발적으로 검사 건수가 증가하여, 빠르고 정확한 검사의 필요성이 대두되었습니다. 이를 해결하기 위해 딥 러닝 AI를 통한 검사를 통하여 빠른 진단으로 의료관계자들의 진단에 도움을 줄 수 있는 수단을 마련하여 이에 대응하고자 합니다.

1.2. 목표 및 주요 내용

> 본 프로젝트의 목표는 대표적인 3D MRI 뇌종양 데이터셋인 BraTS 데이터셋을 활용하여 뇌종양의 정밀한 Segmentation task를 수행하는 모델을 구축하고 이를 활용하여 웹과 연동해 일종의 연동 체계를 구축하는 것입니다. 이를 위해서 Segmentation을 수행하는 딥 러닝 모델, 사진을 업로드할 DB, 그 결과를 시각화할 웹을 개발했습니다.

주요 기능 : 
+ U-Net 구조를 이용한 높은 정확도의 분할 성능을 가진 모델 훈련
+ Adam optimizer, dice coef, cross entropy loss를 사용한 성능 향상 및 최적화
+ 시각화


### 2. 상세설계

2.1. 시스템 구성도
![image](https://github.com/user-attachments/assets/eac58169-6c79-4e71-b95a-501653ab9720)

모델 U-Net 구조도

![image](https://github.com/user-attachments/assets/579bf698-0586-4725-8e22-acec90d73d00)

서버 구조도

2.2. 사용 기술 및 주요 환경
> + Python, Tensorflow, Keras
> + react, nodejs, flask

2.3 서버 기능
> + react에 업로드 된 nii파일을 nodejs로 보내주는 역할을 함
> + nodejs는 nii파일을 flask로 보내 모델을 활용하여 이미지 분석
> + 이미지 분석한 파일을 nodejs로 보내준 후 데이터베이스에 저장

### 3. 설치 및 사용법

> + Setup env 환경은 install_and_build.sh로 다운로드
> + ipynb 파일 다운로드 후 Jupyter Notebook 사용
> + 모델 세부 구조 및 최적화 등의 상세 과정은 보고서 참고

```
// 주피터 노트북 모델 학습
$ ./install_and_build.sh

git clone https://github.com/pnucse-capstone-2024/Capstone-2024-team-01.git

// flask 환경 설치
cd web
cd backend/flask

// venv 활용
python -m venv myenv

# 가상 환경 활성화 (Windows)
myenv\Scripts\activate

# 가상 환경 활성화 (macOS/Linux)
source myenv/bin/activate

pip install matplotlib opencv-python numpy tensorflow nibabel Flask flask-cors waitress
python app.py

// nodejs 실행
cd web
cd frontend_boot/back_app
npm install
npm run start


// react 실행
cd web
cd frontend_boot/front_app/
npm install
npm run dev
```


### 4. 소개 및 시연 영상

[![2024년 전기 졸업과제 01 AI만들조](https://img.youtube.com/vi/9Kh_lqWs9pA/hqdefault.jpg)](https://www.youtube.com/watch?v=9Kh_lqWs9pA)

### 5. 팀소개

박지환
- 역할 : 딥러닝 모델 개발, 데이터 전처리, 모델 고도화 및 평가
- 메일 : pgihwan32@naver.com

허진수
- 역할 : 애플리케이션 구현, API 개발, 개발환경 숙달
- 메일 : j5086@naver.com





