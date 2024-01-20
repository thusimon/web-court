import os
import shutil
from pathlib import Path
import numpy as np
import wget

cwd = Path.cwd()
tf = cwd / 'tf'
CUSTOM_MODEL_NAME = 'my_ssd_mobnet' 
PRETRAINED_MODEL_NAME = 'ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8'
PRETRAINED_MODEL_URL = 'http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz'
TF_RECORD_SCRIPT_NAME = 'generate_tfrecord.py'
LABEL_MAP_NAME = 'label_map.pbtxt'

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
files = {
  'PIPELINE_CONFIG': tf / 'workspace' / 'models' / CUSTOM_MODEL_NAME / 'pipeline.config',
  'TF_RECORD_SCRIPT': paths['SCRIPTS_PATH'] / TF_RECORD_SCRIPT_NAME, 
  'LABELMAP': paths['ANNOTATION_PATH'] / LABEL_MAP_NAME
}

def createFolders():
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

def downloadAndInstallPackages():
  if os.name=='nt':
    os.system('pip install wget')
    import wget
  objDetectPath = paths['APIMODEL_PATH'] / 'research' / 'object_detection'
  if not objDetectPath.exists():
    os.system(f'git clone https://github.com/tensorflow/models {paths["APIMODEL_PATH"]}')
  if os.name=='posix':  
    os.system('apt-get install protobuf-compiler')
    os.system('cd tf/models/research && protoc object_detection/protos/*.proto --python_out=. && cp object_detection/packages/tf2/setup.py . && python -m pip install . ') 
  if os.name=='nt':
    url="https://github.com/protocolbuffers/protobuf/releases/download/v25.2/protoc-25.2-win64.zip"
    wget.download(url)
    os.system(f'move protoc-25.2-win64.zip {paths["PROTOC_PATH"]}')
    os.system(f'cd {paths["PROTOC_PATH"]} && tar -xf protoc-25.2-win64.zip')
    os.environ['PATH'] += os.pathsep + os.path.abspath(os.path.join(paths['PROTOC_PATH'], 'bin'))   
    os.system('cd tf/models/research && protoc object_detection/protos/*.proto --python_out=. && copy object_detection\\packages\\tf2\\setup.py setup.py && python setup.py build && python setup.py install')
    os.system('cd tf/models/research/slim && pip install -e .')
    os.system('pip install tensorflow --upgrade')
    os.system('pip install matplotlib')
    os.system('pip install Pillow')
    os.system('pip install PyYaml')
    #os.system('pip install protobuf')

def downloadModel():
  if os.name == 'posix':
    os.system(f'wget {PRETRAINED_MODEL_URL}')
    os.system(f'mv {PRETRAINED_MODEL_NAME}.tar.gz {paths["PRETRAINED_MODEL_PATH"]}')
    os.system(f'cd {paths["PRETRAINED_MODEL_PATH"]} && tar -zxvf {PRETRAINED_MODEL_NAME}.tar.gz')
  if os.name == 'nt':
    wget.download(PRETRAINED_MODEL_URL)
    os.system(f'move {PRETRAINED_MODEL_NAME}.tar.gz {paths["PRETRAINED_MODEL_PATH"]}')
    os.system(f'cd {paths["PRETRAINED_MODEL_PATH"]} && tar -zxvf {PRETRAINED_MODEL_NAME}.tar.gz')

def verifyTFAndModels():
  VERIFICATION_SCRIPT = paths['APIMODEL_PATH'] / 'research' / 'object_detection' / 'builders' / 'model_builder_tf2_test.py'
  # Verify Installation
  os.system(f'python {VERIFICATION_SCRIPT}')

if __name__ == '__main__':
  #createFolders()
  #prepareTrainTest()
  #fillTrainTest(0.2)
  #downloadAndInstallPackages()
  downloadModel()
  verifyTFAndModels()
