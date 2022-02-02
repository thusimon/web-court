export const buildFeatures = (featureTable: HTMLTableElement, features: Array<object>) => {
  if (features.length < 1) {
    return;
  }
  const feature = features[0];
  const keys = Object.keys(feature);
  const tableHeader = document.createElement('tr');
  const ths = keys.map(key => {
    const th = document.createElement('th');
    th.textContent = key;
    return th;
  });
  tableHeader.append(...ths);

  const tableBodyRows = features.map(f => {
    const tr = document.createElement('tr');
    const fvalues = Object.values(f);
    const tds = fvalues.map(fv => {
      const td = document.createElement('td');
      td.textContent = fv;
      return td;
    });
    tr.append(...tds);
    return tr;
  });

  featureTable.append(tableHeader);
  featureTable.append(...tableBodyRows);
};
