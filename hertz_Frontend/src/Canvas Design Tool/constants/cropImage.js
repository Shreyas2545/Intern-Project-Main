// Simple helper that crops an <img src> url using an off‑screen canvas
export async function cropImage(originalUrl, cropRect, displayedSize) {
  // cropRect & displayedSize are in DISPLAYED pixels
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scaleX = img.naturalWidth / displayedSize.width;
      const scaleY = img.naturalHeight / displayedSize.height;

      const canvas = document.createElement('canvas');
      canvas.width  = cropRect.width  * scaleX;
      canvas.height = cropRect.height * scaleY;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        cropRect.x * scaleX,
        cropRect.y * scaleY,
        cropRect.width  * scaleX,
        cropRect.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas export failed'));
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = originalUrl;
  });
}
