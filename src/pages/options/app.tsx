import { useState, useEffect } from 'react';
import { storage } from 'webextension-polyfill';
import { StorageCategory } from '../../constants';
import { getSystemInfo } from '../../common/misc';
import { downloadData, getImageLabelData } from '../../common/storage';

import './app.scss';

const App = () => {
  const [downloadFolder, setDownloadFolder] = useState('');

  useEffect(() => {
    (async () => {
      const configsStore = await storage.local.get(StorageCategory.Configs);
      const configs = configsStore[StorageCategory.Configs] || {};
      if (configs.downloadFolder) {
        setDownloadFolder(configs.downloadFolder);
        return;
      }
      const os = await getSystemInfo();
      switch (os.os) {
        case 'win':
        case 'mac':
        default: {
          setDownloadFolder('/web-court-dev');
          break;
        }
      } 
    })();
  }, []);

  const onDownloadImagesClick = async () => {
    const imageData = await getImageLabelData();
    return await Promise.all(imageData.map(image => {
      return downloadData({
        url: image.imgUri,
        filename: `${downloadFolder}/${image.id}.png`
      });
    }));

  };

  const onConfirmClick = async () => {
    const configsStore = await storage.local.get(StorageCategory.Configs);
    const configs = configsStore[StorageCategory.Configs] || {};
    configs.downloadFolder = downloadFolder;
    await storage.local.set({ [StorageCategory.Configs]: configs });
  };

  return <div className='options-main'>
    <h1>Web-Court Options</h1>
    <div className='features'>
      <input type='radio' value='dom-feature' name='feature-type' />
      <label>Dom Feature</label>
      <input type='radio' value='image-feature' name='feature-type' />
      <label>Image Feature</label>
    </div>
    <hr></hr>
    <div className='downloads'>
      <label>Download Folder Path: </label>
      <input placeholder='Download folder' value={downloadFolder}
        onChange={(evt) => {setDownloadFolder(evt.target.value);}}/>
      <button onClick={onDownloadImagesClick}>Download Images</button>
    </div>
    <hr></hr>
    <button onClick={onConfirmClick}>Confirm</button>
  </div>;
};

export default App;
