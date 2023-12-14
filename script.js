const video = document.getElementById('video')
var facialMood;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => { video.srcObject = stream; }, (err) => console.error(err));
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    if (detections[0].expressions) {
      // console.log(detections[0].expressions);
      const expressions = detections[0].expressions;
      if (expressions.angry > 0.6) {
        mood = "angry";
        stopStreamedVideo(video, mood);
      }
      if (expressions.neutral > 0.6) {
        mood = "neutral";
        stopStreamedVideo(video, mood);
      }
      if (expressions.happy > 0.6) {
        mood = "happy";
        stopStreamedVideo(video, mood);
      }
      if (expressions.surprised > 0.6) {
        mood = "suprised";
        stopStreamedVideo(video, mood);
      }
      if (expressions.sad > 0.6) {
        mood = "sad";
        stopStreamedVideo(video, mood);
      }
    }
    // break;
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // console.log(resizedDetections);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 5000)
})


function stopStreamedVideo(videoElem, mood) {
  const stream = videoElem.srcObject;
  const tracks = stream.getTracks();
  // console.log(mood);
  facialMood = mood;
  tracks.forEach(function (track) {
    track.stop();
  });

  videoElem.srcObject = null;
  window.open("/index2.html");
  localStorage.setItem("vOneLocalStorage", facialMood);
  // window.close();
}

video.pause();
video.removeAttribute('src'); // empty source
video.load();


// export function hello() {
//   return facialMood;
// }















