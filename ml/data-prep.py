import os
import shutil
from pathlib import Path
import numpy as np

# create train and test folder and randomly fill images and labels
dataPath = Path.cwd() / 'dataset'
trainPath = dataPath / 'train'
testPath = dataPath / 'test'

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
   prepareTrainTest()
   fillTrainTest(0.2)