from ultralytics import YOLO

#run at tf/yolo folder

trainedModelPath = 'login_detect/train6/weights/best.pt'

def train():
  #load a model
  #model = YOLO('yolov8n.yaml')  # build a new model from YAML
  # pretrained model choices: [yolov8n.pt, yolov8s.pt, yolov8m.pt, yolov8l.pt, yolov8x.pt]
  model = YOLO('yolov8l.pt')  # load a pretrained model (recommended for training)
  #model = YOLO('yolov8n.yaml').load('yolov8n.pt')  # build from YAML and transfer weights

  results = model.train(data='config.yaml', project='login_detect', epochs=50)

def validate():
  model = YOLO(trainedModelPath)  # load a custom model
  # Validate the model
  metrics = model.val(data='config.yaml', project='login_detect', conf=0.25)  # no arguments needed, dataset and settings remembered
  metrics.box.map    # map50-95
  metrics.box.map50  # map50
  metrics.box.map75  # map75
  metrics.box.maps   # a list contains map50-95 of each category

def predict():
  # Load a pretrained YOLOv8n model
  model = YOLO(trainedModelPath)
  # Define path to the image file
  source = 'data/images/test'
  model.predict(source=source, project='login_detect', save=True, conf=0.25)

def predictImg(img):
  model = YOLO(trainedModelPath)
  # Define path to the image file
  source = f'data/images/test/{img}'
  result = model.predict(source, project='login_detect', save=True, conf=0.25)
  resultJSON = result[0].tojson()
  print(resultJSON)

def exportTFJS():
  model = YOLO(trainedModelPath)
  model.export(format="tfjs")

if __name__ == '__main__':
  #train()
  #validate()
  #predict()
  exportTFJS()
