function MediaInfoPromise(file) {
  return new Promise(function (resolve, reject) {
    MediaInfo({ format: "object" }, (mediainfo) => {
      let getSize = () => file.size;
      let readChunk = (chunkSize, offset) =>
        new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = (event) => {
            if (event.target.error) {
              reject(event.target.error);
            }
            resolve(new Uint8Array(event.target.result));
          };
          reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
        });

      mediainfo
        .analyzeData(getSize, readChunk)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  });
}
 // some changes
 
function moveFarward() {
  if (curframe <= frameCount) {
    video_element.currentTime += 1 / frameRate;
    curframe += 1;
    CurrentFrameElement.innerHTML = "Current Frame Number : " + curframe;
  }
}
function moveBackward() {
  if (curframe > 0) {
    video_element.currentTime -= 1 / frameRate;
    curframe -= 1;
    CurrentFrameElement.innerHTML = "Current Frame Number : " + curframe;
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") moveBackward();
  if (event.key == "ArrowRight") moveFarward();
});
