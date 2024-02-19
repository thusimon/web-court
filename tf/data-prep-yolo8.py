import os
import shutil
from pathlib import Path
import numpy as np

cwd = Path.cwd()
yoloDataP = cwd / 'tf' / 'yolo' / 'data'
dataPath = cwd / 'dataset'

paths = {
  'images': yoloDataP / 'images',
  'labels': yoloDataP / 'labels'
}

def prepareTrainValidateTest(trainRatio, valRatio):
  # recreate the train and test directory
  if paths['images'].exists():
    shutil.rmtree(paths['images'])
  if paths['labels'].exists():
    shutil.rmtree(paths['labels'])
  os.makedirs(paths['images'])
  os.makedirs(paths['labels'])
  print('shuffle and copy train, validate and test data...')
  imagePath = dataPath / 'images'
  images = [path for path in imagePath.glob('*.png')]
  imageCount = len(images)
  trainCount = round(imageCount * trainRatio)
  valCount = round(imageCount * valRatio)
  #resuffle the images
  np.random.shuffle(images)
  imageTypes = {
    'train': images[:trainCount],
    'val': images[trainCount:trainCount+valCount],
    'test': images[trainCount+valCount:]
  }

  for key in imageTypes:
    images = imageTypes[key]
    imgDestPath = paths['images'] / key
    labelDestPath = paths['labels'] / key
    if not imgDestPath.exists():
      os.makedirs(imgDestPath)
    if not labelDestPath.exists():
      os.makedirs(labelDestPath)
    for img in images:
      label = Path(img).with_suffix('.txt')
      shutil.copy2(img, imgDestPath)
      shutil.copy2(label, labelDestPath)

if __name__ == '__main__':
  prepareTrainValidateTest(0.8, 0.1)
