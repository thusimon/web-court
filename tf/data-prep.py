import os
import shutil
from pathlib import Path
import numpy as np
import wget
import tensorflow as tf
from object_detection.utils import config_util
from object_detection.protos import pipeline_pb2
from google.protobuf import text_format

cwd = Path.cwd()
tfP = cwd / 'tf'
CUSTOM_MODEL_NAME = 'my_ssd_mobnet'
#mobilenet
#PRETRAINED_MODEL_NAME = 'ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8'
#PRETRAINED_MODEL_URL = 'http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz'
#resnet
#PRETRAINED_MODEL_NAME = 'ssd_resnet50_v1_fpn_1024x1024_coco17_tpu-8'
#PRETRAINED_MODEL_URL = 'http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_resnet50_v1_fpn_1024x1024_coco17_tpu-8.tar.gz'
#mobilenet high res
PRETRAINED_MODEL_NAME = 'ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8'
PRETRAINED_MODEL_URL = 'http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_640x640_coco17_tpu-8.tar.gz'

TF_RECORD_SCRIPT_NAME = 'generate_tfrecord.py'
LABEL_MAP_NAME = 'label_map.pbtxt'

paths = {
  'WORKSPACE_PATH': tfP / 'workspace',
  'SCRIPTS_PATH': tfP / 'scripts',
  'APIMODEL_PATH': tfP / 'models',
  'ANNOTATION_PATH': tfP / 'workspace' / 'annotations',
  'IMAGE_PATH': tfP / 'workspace' / 'images',
  'MODEL_PATH': tfP / 'workspace' / 'models',
  'PRETRAINED_MODEL_PATH': tfP / 'workspace' / 'pre-trained-models',
  'CHECKPOINT_PATH': tfP / 'workspace' / 'models' / CUSTOM_MODEL_NAME, 
  'OUTPUT_PATH': tfP / 'workspace' / 'models' / CUSTOM_MODEL_NAME / 'export', 
  'TFJS_PATH': tfP / 'workspace' / 'models' / CUSTOM_MODEL_NAME / 'tfjsexport', 
  'TFLITE_PATH': tfP / 'workspace' / 'models' / CUSTOM_MODEL_NAME / 'tfliteexport', 
  'PROTOC_PATH': tfP / 'protoc'
}
files = {
  'PIPELINE_CONFIG': tfP / 'workspace' / 'models' / CUSTOM_MODEL_NAME / 'pipeline.config',
  'TF_RECORD_SCRIPT': paths['SCRIPTS_PATH'] / TF_RECORD_SCRIPT_NAME, 
  'LABELMAP': paths['ANNOTATION_PATH'] / LABEL_MAP_NAME
}

def createFolders():
  for path in paths.values():
    if not os.path.exists(path):
      os.makedirs(path)

# create train and test folder and randomly fill images and labels
dataPath = cwd / 'dataset'
tfImagePath = tfP / 'workspace' / 'images' 
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
    os.system('pip install tensorflow==2.13.0') #higher version has error
    os.system('pip install matplotlib')
    os.system('pip install Pillow')
    os.system('pip install PyYaml')
    os.system('pip install pytz')
    os.system('pip install gin-config')
    os.system('pip install tensorflowjs')
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

labels = [{'name':'login_form', 'id':1}, {'name':'login_button', 'id':2}]
def createLabels():
  with open(files['LABELMAP'], 'w') as f:
    for label in labels:
      f.write('item { \n')
      f.write('\tname:\'{}\'\n'.format(label['name']))
      f.write('\tid:{}\n'.format(label['id']))
      f.write('}\n')

def createTFRecords():
  ARCHIVE_FILES = paths['IMAGE_PATH'] / 'archive.tar.gz'
  if ARCHIVE_FILES.exists():
    os.system(f'tar -zxvf {ARCHIVE_FILES}')
  if not files['TF_RECORD_SCRIPT'].exists():
    shutil.copy2(tfP / 'generate_tfrecord.py', paths['SCRIPTS_PATH'])
  os.system(f'python {files["TF_RECORD_SCRIPT"]} -x {paths["IMAGE_PATH"] / "train"} -l {files["LABELMAP"]} -o {paths["ANNOTATION_PATH"] / "train.record"}')
  os.system(f'python {files["TF_RECORD_SCRIPT"]} -x {paths["IMAGE_PATH"] / "test"} -l {files["LABELMAP"]} -o {paths["ANNOTATION_PATH"] / "test.record"}')

def copyAndConfigModal():
  shutil.copy2(paths['PRETRAINED_MODEL_PATH'] / PRETRAINED_MODEL_NAME / 'pipeline.config', paths['CHECKPOINT_PATH'])
  config = config_util.get_configs_from_pipeline_file(files['PIPELINE_CONFIG'])
  pipeline_config = pipeline_pb2.TrainEvalPipelineConfig()
  with tf.io.gfile.GFile(files['PIPELINE_CONFIG'], 'r') as f:
    proto_str = f.read()
    text_format.Merge(proto_str, pipeline_config)
  pipeline_config.model.ssd.num_classes = len(labels)
  pipeline_config.train_config.batch_size = 4
  pipeline_config.train_config.fine_tune_checkpoint = str(paths['PRETRAINED_MODEL_PATH'] / PRETRAINED_MODEL_NAME / 'checkpoint' / 'ckpt-0')
  pipeline_config.train_config.fine_tune_checkpoint_type = 'detection'
  pipeline_config.train_input_reader.label_map_path= str(files['LABELMAP'])
  pipeline_config.train_input_reader.tf_record_input_reader.input_path[:] = [str(paths['ANNOTATION_PATH'] / 'train.record')]
  pipeline_config.eval_input_reader[0].label_map_path = str(files['LABELMAP'])
  pipeline_config.eval_input_reader[0].tf_record_input_reader.input_path[:] = [str(paths['ANNOTATION_PATH'] / 'test.record')]
  config_text = text_format.MessageToString(pipeline_config)
  with tf.io.gfile.GFile(files['PIPELINE_CONFIG'], 'wb') as f:
    f.write(config_text)   

def showCommands():
  TRAINING_SCRIPT = paths['APIMODEL_PATH'] / 'research' / 'object_detection' / 'model_main_tf2.py'
  trainCommand = f'python {TRAINING_SCRIPT} --model_dir={paths["CHECKPOINT_PATH"]} --pipeline_config_path={files["PIPELINE_CONFIG"]} --num_train_steps=2000'
  testCommand = f'python {TRAINING_SCRIPT} --model_dir={paths["CHECKPOINT_PATH"]} --pipeline_config_path={files["PIPELINE_CONFIG"]} --checkpoint_dir={paths["CHECKPOINT_PATH"]}'
  print('Training command:')
  print(trainCommand)
  print('Testing command')
  print(testCommand)
  #cd to model_dir/eval
  tfBoardCommand = 'tensorboard --logdir=.'
  FREEZE_SCRIPT = paths['APIMODEL_PATH'] / 'research' / 'object_detection' / 'exporter_main_v2.py'
  freezeCommand = f'python {FREEZE_SCRIPT} --input_type=image_tensor --pipeline_config_path={files["PIPELINE_CONFIG"]} --trained_checkpoint_dir={paths["CHECKPOINT_PATH"]} --output_directory={paths["OUTPUT_PATH"]}'
  print('Freeze command')
  print(freezeCommand)
  tfjsCommand = f"tensorflowjs_converter --input_format=tf_saved_model --output_node_names='detection_boxes,detection_classes,detection_features,detection_multiclass_scores,detection_scores,num_detections,raw_detection_boxes,raw_detection_scores' --output_format=tfjs_graph_model --signature_name=serving_default {paths['OUTPUT_PATH'] / 'saved_model'} {paths['TFJS_PATH']}"
  print('TFJS command')
  print(tfjsCommand)

if __name__ == '__main__':
  #createFolders()
  #prepareTrainTest()
  #fillTrainTest(0.2)
  #downloadAndInstallPackages()
  #downloadModel()
  #verifyTFAndModels()
  #createLabels()
  #createTFRecords()
  #copyAndConfigModal()
  showCommands()
