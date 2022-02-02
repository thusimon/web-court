import './features.css';
import { getFieldFeatures, getPageFeatures } from '../../content/utils/storage';
import { buildFeatures } from './build-features';

const container = document.createElement('div');
container.id = 'container';

const headers = document.createElement('div');
headers.id = 'headers'

const features = document.createElement('div');
features.id = 'features';

const featurePageTable = document.createElement('table');
featurePageTable.id = 'page-feature-table';
featurePageTable.classList.add('feature-table');

const featureFieldTable = document.createElement('table');
featureFieldTable.id = 'field-feature-table';
featureFieldTable.classList.add('feature-table');

const pageFeatures = await getPageFeatures();
const fieldFeatures = await getFieldFeatures();

buildFeatures(featurePageTable, pageFeatures);
buildFeatures(featureFieldTable, fieldFeatures);

features.append(featurePageTable, featureFieldTable);

container.append(headers, features);

document.body.append(container);