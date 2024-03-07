import { useState, useEffect, useRef } from 'react';
import { storage, runtime, Runtime } from 'webextension-polyfill';
import { StorageCategory } from '../../constants';
import { getSystemInfo } from '../../common/misc';
import { downloadData, getImageLabelData } from '../../common/storage';

import './app.scss';

const HOST_ID = 'com.utticus.net.host';

const App = () => {
  const [downloadFolder, setDownloadFolder] = useState('');
  const [port, setPort] = useState<Runtime.Port>(null);
  const [portConnect, setPortConnect] = useState(false)
  const rangeMinInput = useRef(null);
  const rangeMaxInput = useRef(null);
  const messageInput = useRef(null);
  const consoleInput = useRef(null);

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

    const port = runtime.connectNative(HOST_ID);
    setPort(port);
    setPortConnect(true);
    port.onMessage.addListener(function (msg) {
      if (!consoleInput.current) {
        return;
      }
      consoleInput.current.value += `From Host: ${msg}\n`;
    });
    port.onDisconnect.addListener(function () {
      setPortConnect(false);
      if (!consoleInput.current) {
        return;
      }
      const err = runtime.lastError?.message
      consoleInput.current.value += `Err: ${err}\n`;
    });
  }, []);

  const onDownloadImagesClick = async () => {
    let lowBound = null;
    let upBound = null;
    if (rangeMinInput.current) {
      const lowBoundParsed = Number.parseInt(rangeMinInput.current.value);
      if (Number.isInteger(lowBoundParsed)) {
        lowBound = lowBoundParsed;
      }
    }
    if (rangeMaxInput.current) {
      const upBoundParsed = Number.parseInt(rangeMaxInput.current.value);
      if (Number.isInteger(upBoundParsed)) {
        upBound = upBoundParsed;
      }
    }
    const imageData = await getImageLabelData(lowBound, upBound);
    return await Promise.all(imageData.map((image: any) => {
      const url = new URL(image.url);
      return downloadData({
        url: image.imgUri,
        filename: `${downloadFolder}/${url.hostname}_${image.id}.png`,
        conflictAction: 'overwrite'
      });
    }));
  };

  const onConfirmClick = async () => {
    const configsStore = await storage.local.get(StorageCategory.Configs);
    const configs = configsStore[StorageCategory.Configs] || {};
    configs.downloadFolder = downloadFolder;
    await storage.local.set({ [StorageCategory.Configs]: configs });
  };

  const sendMessageToHost = () => {
    if (!messageInput.current || !port || !portConnect) {
      return;
    }
    const message = messageInput.current.value;
    port.postMessage(message);
  }

  // to config native messaging, refer to: https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging

  return <div className='options-main'>
    <h1>Web-Court Options</h1>
    <div className='features'>
      <input type='radio' value='dom-feature' name='feature-type' />
      <label>Dom Feature</label>
      <input type='radio' value='image-feature' name='feature-type' />
      <label>Image Feature</label>
    </div>
    <hr></hr>
    <div className='downloads section'>
      <div className='folder'>
        <label>Download Folder Path: </label>
        <input placeholder='Download folder' value={downloadFolder}
          onChange={(evt) => {setDownloadFolder(evt.target.value);}}></input>
      </div>
      <div className='range'>
        <label>ID Range: </label>
        <span>
          From <input type='number' ref={rangeMinInput}></input> To <input type='number' ref={rangeMaxInput}></input>
        </span> 
      </div>
      <div>
        <button onClick={onDownloadImagesClick}>Download Images</button>
      </div>
    </div>
    <button onClick={onConfirmClick}>Confirm</button>
    <hr></hr>
    <div className='native-messaging section'>
      <h1>Native Messaging</h1>
      <input id='message-to-host' defaultValue='ping' ref={messageInput}></input>
      <button onClick={sendMessageToHost}>Send</button>
      <textarea id='native-messaging-console' ref={consoleInput}></textarea>
    </div>
  </div>;
};

export default App;
