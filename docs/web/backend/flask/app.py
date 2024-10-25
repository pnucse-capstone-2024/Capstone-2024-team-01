import matplotlib
matplotlib.use('Agg')  # Tkinter 사용을 피하는 백엔드 설정
import matplotlib.pyplot as plt
import cv2
import numpy as np
import tensorflow as tf
import numpy as np
import nibabel as nib
import cv2
import tensorflow as tf
import os
from waitress import serve
from flask_cors import CORS  # CORS import
import traceback
from concurrent.futures import ThreadPoolExecutor





# Flask API 예시 (HTTP 서버)
from flask import Flask, request, jsonify
app = Flask(__name__)
CORS(app)  # CORS 허용

from metrics import dice_coef
K = tf.keras.backend

model = tf.keras.models.load_model('3D_MRI_Brain_tumor_segmentation.h5')

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=[dice_coef, 'accuracy'])

IMG_SIZE = 128
IMG_NUMBER = 2
DPI = 300

def preprocess_image(image_file, slice_index=None, view='axial'):
    # Load the NIfTI file
    img = nib.load(image_file).get_fdata()

    # Select a specific slice if needed
    if slice_index is not None:
        if view == 'axial':
            img = img[:, :, slice_index]
        elif view == 'coronal':
            img = img[:, slice_index, :]
        elif view == 'sagittal':
            img = img[slice_index, :, :]
        else:
            raise ValueError("Invalid view. Choose from 'axial', 'coronal', 'sagittal'.")

    # Resize the image to (IMG_SIZE, IMG_SIZE)
    img_resized = cv2.resize(img, (IMG_SIZE, IMG_SIZE))

    # Normalize the image
    img_resized = img_resized / np.max(img_resized)

    return img_resized

def get_unique_directory(base_dir, path):
    """
    주어진 base_dir 이름으로 디렉토리를 생성하되, 이미 존재하면 번호를 붙여서 유일한 디렉토리 이름을 반환.
    예: output_dir, output_dir_1, output_dir_2, ...
    """
    # 폴더가 있으면 번호를 붙이기 시작
    counter = 0
    while True:
        path2 = f"{path}_{counter}"  # 번호가 붙은 새로운 디렉토리 이름
        base_dir3 = base_dir + path2
        if not os.path.exists(base_dir3):
            return base_dir3, path2
        
        counter += 1

def save_slices(nii_file, output_dir, view):
    data = nib.load(nii_file).get_fdata()

    depth = 0
    if view == 'axial':
        depth = data.shape[2]
        Median = depth // 2
        MedianMax = Median+ 60
        MedianMin = Median - 60
        if depth < (MedianMax):
            MedianMax = Median + 50

        if (MedianMin) < 0:
            MedianMin = Median - 50
        
        a = range(MedianMin, MedianMax, IMG_NUMBER)
    elif view == 'coronal':
        depth = data.shape[1]
        Median = depth // 2
        MedianMax = Median+ 60
        MedianMin = Median - 60
        if depth < (MedianMax):
            MedianMax = Median + 50

        if (MedianMin) < 0:
            MedianMin = Median - 50
        
        a = range(MedianMin, MedianMax, IMG_NUMBER)
    elif view == 'sagittal':
        depth = data.shape[0]
        Median = depth // 2
        MedianMax = Median+ 60
        MedianMin = Median - 60
        if depth < (MedianMax):
            MedianMax = Median + 50

        if (MedianMin) < 0:
            MedianMin = Median - 50
        
        a = range(MedianMin, MedianMax, IMG_NUMBER)
    else:
        raise ValueError("Invalid view. Choose from 'axial', 'coronal', 'sagittal'.")
        
    # 필요한 디렉토리를 생성합니다.
    os.makedirs(output_dir, exist_ok=True)
    for i in a:
        # 원본 이미지를 불러옵니다
        img = preprocess_image(nii_file, i, view)
        if np.max(img) == 0:
            print("Warning: Image max value is 0, skipping this slice.")
            continue  # 이 슬라이스를 건너뛰도록 처리
        plt.figure(figsize=(IMG_SIZE / DPI * 5, IMG_SIZE / DPI * 5))
        plt.imshow(img.T, cmap='gray', origin='lower')
        plt.axis('off')
        i = i - (MedianMin)
        # 이미지 파일을 저장합니다.
        slice_path = os.path.join(output_dir, f'slice_{i//IMG_NUMBER}.png')  # 슬라이스 이미지 경로
        plt.savefig(slice_path, bbox_inches='tight', pad_inches=0, dpi = DPI)
        plt.close()


def size(nii_file):
    img = nib.load(nii_file)
    data = img.get_fdata()

    depth = data.shape[2]
    Median = depth // 2
    MedianMax = Median+ 60
    MedianMin = Median - 60
    if depth < (MedianMax):
        MedianMax = Median + 50

    if (MedianMin) < 0:
        MedianMin = Median - 50
        
    a = range(MedianMin, MedianMax, IMG_NUMBER)
        
    return len(a)

def predict(image_paths, folder, view='axial', fun_name = "flair"):
    X = np.zeros((1, IMG_SIZE, IMG_SIZE, 2))
    
    # 디렉토리가 없으면 생성
    os.makedirs(folder[0], exist_ok=True)
    os.makedirs(folder[1], exist_ok=True)
    # NIfTI 데이터에서 슬라이스 수를 구합니다.
    data = nib.load(image_paths[0]).get_fdata()
    if view == 'axial':
        depth = data.shape[2]
        Median = depth // 2
        MedianMax = Median+ 60
        MedianMin = Median - 60
        if depth < (MedianMax):
            MedianMax = Median + 50

        if (MedianMin) < 0:
            MedianMin = Median - 50
        
        a = range(MedianMin, MedianMax, IMG_NUMBER)

    elif view == 'coronal':
        depth = data.shape[1]
        Median = depth // 2
        MedianMax = Median+ 60
        MedianMin = Median- 60
        if depth < (MedianMax):
            MedianMax = Median + 50

        if (MedianMin) < 0:
            MedianMin = Median - 50
        
        a = range(MedianMin, MedianMax, IMG_NUMBER)
    elif view == 'sagittal':
        depth = data.shape[0]
        Median = depth // 2
        MedianMax = Median+ 60
        MedianMin = Median-60
        if depth < (MedianMax):
            MedianMax = Median + 50

        if (MedianMin) < 0:
            MedianMin = Median - 50
        
        a = range(MedianMin, MedianMax, IMG_NUMBER)
    else:
        raise ValueError("Invalid view. Choose from 'axial', 'coronal', 'sagittal'.")
    
    predicts = []

    for i in a:
        # Process specific slices from the images
        X[0, :, :, 0] = preprocess_image(image_paths[0], i, view)
        X[0, :, :, 1] = preprocess_image(image_paths[1], i, view)

        # Make prediction
        pred = model.predict(X)
        predicts.append(np.argmax(pred[0], axis=-1))
    
    for i in a:
        slice_index = i 
        i = i - (MedianMin)
        flair_overlay(image_paths[0],i, slice_index, predicts[i//IMG_NUMBER], folder[0], view)
        t1ce_overlay(image_paths[1],i, slice_index, predicts[i//IMG_NUMBER], folder[1], view)

        


def flair_overlay(image_paths, i, slice_index, prediction, folder, view):
    try:
        # 원본 이미지를 불러옵니다
        flair_img = preprocess_image(image_paths, slice_index, view)

        # 검증: 이미지 데이터가 None이거나 비정상적인 형태일 경우 오류 처리
        if flair_img is None or not isinstance(flair_img, np.ndarray):
            raise ValueError("Invalid flair image data.")
        if prediction is None or not isinstance(prediction, np.ndarray):
            raise ValueError("Invalid prediction data.")

        # 총 segmentation
        plt.figure(figsize=(IMG_SIZE / DPI * 5, IMG_SIZE / DPI * 5))
        plt.imshow(np.flipud(flair_img.T), cmap='gray')  # 원본 이미지
        plt.imshow(np.flipud(prediction.T), cmap='nipy_spectral', alpha=0.5)  # 예측 결과를 반투명하게 오버레이
        plt.axis('off')

        # 파일 경로를 생성 (예: 'folder/slice_XX_overlay.png')
        overlay_img_path = os.path.join(folder, f'slice_{i//IMG_NUMBER}.png')

        # 오버레이 이미지를 파일로 저장
        plt.savefig(overlay_img_path, bbox_inches='tight', pad_inches=0, dpi = DPI)
        plt.close()
    except Exception as e:
        print(f"Error in flair_overlay: {str(e)}")
        traceback.print_exc()

def t1ce_overlay(image_paths, i, slice_index, prediction, folder, view):
    try:
        # 원본 이미지를 불러옵니다
        t1ce_img = preprocess_image(image_paths, slice_index, view)

        # 검증: 이미지 데이터가 None이거나 비정상적인 형태일 경우 오류 처리
        if t1ce_img is None or not isinstance(t1ce_img, np.ndarray):
            raise ValueError("Invalid t1ce image data.")
        if prediction is None or not isinstance(prediction, np.ndarray):
            raise ValueError("Invalid prediction data.")

        # 총 segmentation
        plt.figure(figsize=(IMG_SIZE / DPI * 5, IMG_SIZE / DPI * 5))
        plt.imshow(np.flipud(t1ce_img.T), cmap='gray')  # 원본 이미지
        plt.imshow(np.flipud(prediction.T), cmap='nipy_spectral', alpha=0.5)  # 예측 결과를 반투명하게 오버레이
        plt.axis('off')

        # 파일 경로를 생성 (예: 'folder/slice_XX_overlay.png')
        overlay_img_path = os.path.join(folder, f'slice_{i//IMG_NUMBER}.png')

        # 오버레이 이미지를 파일로 저장
        plt.savefig(overlay_img_path, bbox_inches='tight', pad_inches=0, dpi = DPI)
        plt.close()
    except Exception as e:
        print(f"Error in t1ce_overlay: {str(e)}")
        traceback.print_exc()


def process_save_slices(view, folder, p_img1, p_img2):
    new_folder1 = folder[0] + f'/{view}'
    new_folder2 = folder[1] + f'/{view}'
    save_slices(p_img1, new_folder1, view)
    save_slices(p_img2, new_folder2, view)


# 예측 함수
def process_predict(view, overlay_folder, p_img1, p_img2):
    new_overlay_folder1 = overlay_folder[0] + f'/{view}'
    new_overlay_folder2 = overlay_folder[1] + f'/{view}'
    predict([p_img1, p_img2], [new_overlay_folder1, new_overlay_folder2] , view)



@app.route('/predict', methods=['POST'])
def predict_endpoint():
    try:
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))  # 부모 디렉토리
        uploads_folder = os.path.join(root_dir, 'frontend_boot/back_app/uploads')

        p_img1 = os.path.join(uploads_folder, 'flair.nii')
        p_img2 = os.path.join(uploads_folder, 't1ce.nii')  

        # 이미지 들어갈 폴더 생성

        uploads_folder = os.path.join(root_dir, 'frontend_boot/front_app/public')
        flair_folder, flair_path = get_unique_directory(uploads_folder, '/new/output_flair')
        t1ce_folder, t1ce_path = get_unique_directory(uploads_folder, '/new/output_t1ce')
        flair_overlay_folder, flair_overlay_path= get_unique_directory(uploads_folder, '/new/overlay_flair')
        t1ce_overlay_folder, t1ce_overlay_path= get_unique_directory(uploads_folder, '/new/overlay_t1ce')
                
        file_size = size(p_img1)
        
        views = ["axial", "coronal", "sagittal" ]
        for view in views:
            with ThreadPoolExecutor() as executor:
                futures = []
        # 각 작업을 추가
                futures.append(executor.submit(process_save_slices, view, [flair_folder, t1ce_folder], p_img1, p_img2))
                futures.append(executor.submit(process_predict, view, [flair_overlay_folder,t1ce_overlay_folder], p_img1, p_img2))

            # 모든 작업 완료 대기
            for future in futures:
                future.result()  # 각 스레드의 결과를 호출해 예외 발생 여부 확인
                
        # 저장된 파일 경로를 반환 (저장된 파일의 이름만 반환)
        return jsonify({
            'flair_path': flair_path,
            't1ce_path': t1ce_path,
            'flair_overlay_path': flair_overlay_path,
            't1ce_overlay_path': t1ce_overlay_path, 
            'new_size': file_size,
        })
    
    except Exception as e:
        error_info = traceback.format_exc()
        return jsonify({'error임': str(e), 'traceback': error_info}), 500

if __name__ == "__main__":
    serve(app,host='0.0.0.0', port=8000)