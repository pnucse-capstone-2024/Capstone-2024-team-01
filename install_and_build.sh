#!/bin/sh
echo 'This is the setup environment for the project'
echo '1. Installing necessary packages'

sudo apt-get update
sudo apt-get install -y python3-pip

pip install opencv-python==4.5.1.48
pip install pillow==7.2.0
pip install numpy==1.19.5
pip install pandas==1.1.5
pip install seaborn==0.11.1
pip install matplotlib==3.3.4
pip install scikit-image==0.18.1
pip install nilearn==0.7.0
pip install nibabel==3.2.1
pip install gif-your-nifti==0.1.6
pip install keras==2.4.3
pip install tensorflow==2.4.1
pip install scikit-learn==0.24.1

echo '2. Setup Complete'

echo 'Installed packages:'
pip freeze | grep -E 'opencv-python|pillow|numpy|pandas|seaborn|matplotlib|scikit-image|nilearn|nibabel|gif-your-nifti|keras|tensorflow|scikit-learn'
