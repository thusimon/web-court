enum ButtonFeatureType {
  auxillary,
  label,
  number,
  string,
  category
};

interface ButtonFeature {
  name: string,
  type: ButtonFeatureType
};

// This varies when collect different features
const buttonFeatures: ButtonFeature[] = [
  { name: 'label', type: ButtonFeatureType.label },
  { name: 'url', type: ButtonFeatureType.auxillary },
  { name: 'tagDiscriptor', type: ButtonFeatureType.auxillary },
  { name: 'PXheight', type: ButtonFeatureType.number }, // nearest user name and password
  { name: 'PXleft', type: ButtonFeatureType.number },
  { name: 'PXtop', type: ButtonFeatureType.number },
  { name: 'PXwidth', type: ButtonFeatureType.number },
  { name: 'PYheight', type: ButtonFeatureType.number },
  { name: 'PYleft', type: ButtonFeatureType.number },
  { name: 'PYtop', type: ButtonFeatureType.number },
  { name: 'PYwidth', type: ButtonFeatureType.number },
  { name: 'UXheight', type: ButtonFeatureType.number },
  { name: 'UXleft', type: ButtonFeatureType.number },
  { name: 'UXtop', type: ButtonFeatureType.number },
  { name: 'UXwidth', type: ButtonFeatureType.number },
  { name: 'UYheight', type: ButtonFeatureType.number },
  { name: 'UYleft', type: ButtonFeatureType.number },
  { name: 'UYtop', type: ButtonFeatureType.number },
  { name: 'UYwidth', type: ButtonFeatureType.number},
  { name: 'samePassXY', type: ButtonFeatureType.category },
  { name: 'sameUserXY', type: ButtonFeatureType.category },
  { name: 'borderRadius', type: ButtonFeatureType.number }, // css
  { name: 'colorB', type: ButtonFeatureType.number },
  { name: 'colorG', type: ButtonFeatureType.number },
  { name: 'colorR', type: ButtonFeatureType.number },
  { name: 'id', type: ButtonFeatureType.string }, // dom
  { name: 'name', type: ButtonFeatureType.string },
  { name: 'tagName', type: ButtonFeatureType.category },
  { name: 'textContent', type: ButtonFeatureType.string },
  { name: 'type', type: ButtonFeatureType.category },
  { name: 'className', type: ButtonFeatureType.string },
  { name: 'disabled', type: ButtonFeatureType.category },
  { name: 'left', type: ButtonFeatureType.number }, // geometry
  { name: 'top', type: ButtonFeatureType.number },
  { name: 'width', type: ButtonFeatureType.number },
  { name: 'height', type: ButtonFeatureType.number }
];
