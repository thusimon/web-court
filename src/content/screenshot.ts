let screenshotVideo: HTMLVideoElement = null;
class Screenshot {
  constructor() {
    if (typeof navigator.mediaDevices.getDisplayMedia == 'function'){
      if (!screenshotVideo){
        screenshotVideo = document.createElement('video');
        screenshotVideo.setAttribute('autoplay', 'true');
      }
      const srcObject = screenshotVideo.srcObject as MediaStream;
      if (!srcObject || !srcObject.active) {
        if (srcObject){
          const tracks = srcObject.getTracks();
          tracks.forEach(track => track.stop());
          screenshotVideo.srcObject = null;
        }
        navigator.mediaDevices.getDisplayMedia({
          audio: false,
          video: true
        })
        .then((record) => {
          screenshotVideo.srcObject = record;
        })
        .catch(e => {
          console.log('You can not take screenshot', e);
        });
      }
    }
    else {
      console.log('browser not support screenshot');
    }
  }

  takeScreenshot(){
    const canvas = document.createElement('canvas');
    const bodyRect = document.body.getBoundingClientRect();
    canvas.width = bodyRect.width;
    canvas.height = bodyRect.height;
    canvas.getContext('2d').drawImage(screenshotVideo, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }
}

export default Screenshot;
