import xml.etree.ElementTree as ET
from pathlib import Path

def getAllXML():
  cwd = Path.cwd()
  xmlFolder = cwd / 'dataset' / 'images'
  return xmlFolder.glob('*.xml')

def converXML2TXT(xmlPath: Path):
  txtFile = xmlPath.parent / f'{xmlPath.stem}.txt'
  with open(txtFile, 'w') as txt:
    tree = ET.parse(xmlPath)
    size = tree.find('./size')
    picWidth = float(size.find('./width').text)
    picHeight = float(size.find('./height').text)
    labels = tree.findall('./object/bndbox')
    labelResults = []
    for idx, l in enumerate(labels):
      xmin = float(l.find('./xmin').text)
      ymin = float(l.find('./ymin').text)
      xmax = float(l.find('./xmax').text)
      ymax = float(l.find('./ymax').text)
      xcenter = (xmin + xmax) / 2 / picWidth
      ycenter = (ymin + ymax) / 2 / picHeight
      x = (xmax - xmin) / picWidth
      y = (ymax - ymin) / picHeight
      result = '%d %.6f %.6f %.6f %.6f\n' % (idx, xcenter, ycenter, x, y)
      labelResults.append(result)
    txt.writelines(labelResults)
  print(f'{xmlPath} converted...')

def main():
  xmlFiles = getAllXML()
  for f in xmlFiles:
    converXML2TXT(f)

if __name__ == '__main__':
  main()
