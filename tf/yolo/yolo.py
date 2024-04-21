import argparse
from ultralytics import YOLO

#run at tf/yolo folder

trainedModelPath = 'login_detect/train6/weights/best.pt'

def train(modelSize, epochs):
  #load a model
  # pretrained model choices: [yolov8n.pt, yolov8s.pt, yolov8m.pt, yolov8l.pt, yolov8x.pt]
  model = YOLO(f'yolov8{modelSize}.pt')  # load a pretrained model (recommended for training)
  model.train(data='config.yaml', project='login_detect', epochs=epochs)

def validate(modalFolder):
  trainedModelPath = f'login_detect/{modalFolder}/weights/best.pt'
  model = YOLO(trainedModelPath)  # load a custom model
  # Validate the model
  metrics = model.val(data='config.yaml', project='login_detect', conf=0.25)  # no arguments needed, dataset and settings remembered
  metrics.box.map    # map50-95
  metrics.box.map50  # map50
  metrics.box.map75  # map75
  metrics.box.maps   # a list contains map50-95 of each category

def predict(modalFolder):
  trainedModelPath = f'login_detect/{modalFolder}/weights/best.pt'
  model = YOLO(trainedModelPath)
  # Define path to the image file
  source = 'data/images/test'
  model.predict(source=source, project='login_detect', save=True, conf=0.25)

def predictImg(modalFolder, img):
  trainedModelPath = f'login_detect/{modalFolder}/weights/best.pt'
  model = YOLO(trainedModelPath)
  # Define path to the image file
  source = f'data/images/test/{img}'
  result = model.predict(source, project='login_detect', save=True, conf=0.25)
  resultJSON = result[0].tojson()
  print(resultJSON)

def exportTFJS(modalFolder):
  trainedModelPath = f'login_detect/{modalFolder}/weights/best.pt'
  model = YOLO(trainedModelPath)
  model.export(format='tfjs')

parser = argparse.ArgumentParser()
parser.add_argument('--target', help='choose from [train, validate, predict, convert_tfjs]')
parser.add_argument('--train-model-size', help='choose from [n, s, m, l, x]')
parser.add_argument('--train-epoch', type=int, help='epoch time for training')
parser.add_argument('--model-folder', help='model folder')
parser.add_argument('--predict-img', help='image to predict')

if __name__ == '__main__':
  args = parser.parse_args()
  target = args.target
  match target:
    case 'train':
      modelSize = args.train_model_size
      epoch = args.train_epoch
      train(modelSize, epoch)
    case 'validate':
      modalFolder = args.model_folder
      validate(modalFolder)
    case 'predict':
      modalFolder = args.model_folder
      predict(modalFolder)
    case 'predict-img':
      modalFolder = args.model_folder
      img = args.predict_img
      predictImg(modalFolder, img)
    case 'convert-tfjs':
      modalFolder = args.model_folder
      exportTFJS(modalFolder)
    case _:
      print('unknown target')
