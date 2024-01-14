import os
import shutil
from pathlib import Path
import numpy as np

cwd = Path.cwd()
tf = cwd / 'tf'
CUSTOM_MODEL_NAME = 'my_ssd_mobnet' 
PRETRAINED_MODEL_NAME = 'ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8'
PRETRAINED_MODEL_URL = 'http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz'
TF_RECORD_SCRIPT_NAME = 'generate_tfrecord.py'
LABEL_MAP_NAME = 'label_map.pbtxt'

def createFolders():
  paths = {
    'WORKSPACE_PATH': tf / 'workspace',
    'SCRIPTS_PATH': tf / 'scripts',
    'APIMODEL_PATH': tf / 'models',
    'ANNOTATION_PATH': tf / 'workspace' / 'annotations',
    'IMAGE_PATH': tf / 'workspace' / 'images',
    'MODEL_PATH': tf / 'workspace' / 'models',
    'PRETRAINED_MODEL_PATH': tf / 'workspace' / 'pre-trained-models',
    'CHECKPOINT_PATH': tf / 'workspace' / 'models' / CUSTOM_MODEL_NAME, 
    'OUTPUT_PATH': tf / 'workspace' / 'models' / CUSTOM_MODEL_NAME / 'export', 
    'TFJS_PATH': tf / 'workspace' / 'models' / CUSTOM_MODEL_NAME / 'tfjsexport', 
    'TFLITE_PATH': tf / 'workspace' / 'models' / CUSTOM_MODEL_NAME / 'tfliteexport', 
    'PROTOC_PATH': tf / 'protoc'
  }
  for path in paths.values():
    if not os.path.exists(path):
        os.makedirs(path)

# create train and test folder and randomly fill images and labels
dataPath = cwd / 'dataset'
tfImagePath = tf / 'workspace' / 'images' 
trainPath = tfImagePath / 'train'
testPath = tfImagePath / 'test'

def prepareTrainTest():
  # recreate the train and test directory
  if trainPath.exists():
    shutil.rmtree(trainPath)
  if testPath.exists():
    shutil.rmtree(testPath)  
  os.makedirs(trainPath)
  os.makedirs(testPath)

def fillTrainTest(ratio: float):
  print('shuffle and copy training and test data...')
  imagePath = dataPath / 'images'
  images = [path for path in imagePath.glob('*.png')]
  imageCount = len(images)
  testCount = round(imageCount * ratio)
  #resuffle the images
  np.random.shuffle(images)
  testImages = images[:testCount]
  trainImages = images[testCount:]
  for testImage in testImages:
    testlabel = Path(testImage).with_suffix('.xml')
    shutil.copy2(testImage, testPath)
    shutil.copy2(testlabel, testPath)
  for trainImage in trainImages:
    trainlabel = Path(trainImage).with_suffix('.xml')
    shutil.copy2(trainImage, trainPath)
    shutil.copy2(trainlabel, trainPath)

if __name__ == '__main__':
    createFolders()
    prepareTrainTest()
    fillTrainTest(0.2)
