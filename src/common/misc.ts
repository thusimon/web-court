import { runtime } from 'webextension-polyfill';

/**
 * @param rect 
 * @returns [centerX, centerY, width, height]
 */
export const getCenter = (rect: DOMRect): number[] => {
  return [
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    rect.width,
    rect.height
  ];
};

export const getSystemInfo = async () => {
  return await runtime.getPlatformInfo();
}

export const dataURLtoBlob = (dataUrl: string) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = Buffer.from(arr[1], 'base64').toString(); //atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
};

export const dataURItoBlob = async (dataUri: string) => {
  const res = await fetch(dataUri);
  const blob = await res.blob();
  return blob;
}

export const blobToDataURI = (blob: Blob): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = _e => resolve(reader.result as string);
    reader.onerror = _e => reject(reader.error);
    reader.onabort = _e => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}
