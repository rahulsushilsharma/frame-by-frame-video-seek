const video_url = "demo.mp4";
const video_element = document.querySelector("video");
const FrameCountElement = document.querySelector("#framecount");
const CurrentFrameElement = document.querySelector("#curframe");
let curframe = 0;
let frameRate = 0;
let frameCount = 0;

async function main() {
  let res = await fetch(video_url);
  let blob = await res.blob();
  let video_meta = await MediaInfoPromise(blob);
  let genral = video_meta.media.track[0];
  frameRate = genral.FrameRate;
  frameCount = genral.FrameCount;

  console.log(genral);
  FrameCountElement.innerHTML = "Number of frames : " + genral.FrameCount;

  let url = URL.createObjectURL(blob);
  const source = document.createElement("source");

  source.src = url;
  source.type = "video/mp4";
  video_element.appendChild(source);
}

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

main();
