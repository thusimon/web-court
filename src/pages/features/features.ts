import './features.css';
import { buildFeatures } from './build-features';

const container = document.createElement('div');
container.id = 'container';

const headers = document.createElement('div');
headers.id = 'headers'

const features = document.createElement('div');
features.id = 'features';

const featureTable = document.createElement('table');
featureTable.id = 'feature-table';
buildFeatures(featureTable);
features.append(featureTable);

container.append(headers, features);

document.body.append(container);