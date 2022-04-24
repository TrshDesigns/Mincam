navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function (stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function (err) {
        console.log("An error occurred: " + err);
    });
//create a function called snapshot that takes the video and output it to the canvas as a snapshot
function snapshot() {
    let videoWidth = document.getElementById("video").videoWidth;
    let videoHeight = document.getElementById("video").videoHeight;
    let galleryBarContainer = document.getElementById('gallery-container');
    var context = canvas.getContext("2d");
    let removeImage = document.createElement("i");
    let saveImage = document.createElement("i");
    let imageContainer = document.createElement("div")
    removeImage.className = "fas fa-trash-alt";
    saveImage.className = "fas fa-save";
    //set a canvas height and width to the video height and width without ruining the aspect ratio 
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    //draw the video to the canvas
    canvas.style.objectFit = 'contain';
    //draw the video to the canvas
    context.drawImage(video, 0, 0, videoWidth, videoHeight);
    setTimeout(function () {
    //add a animate.css animation to the canvas 
    canvas.classList.add("animated", "fadeIn");
    //wait for the animation to finish and then remove the class
    setTimeout(function () {
        canvas.classList.remove("animated", "fadeIn");
    }, 1000);
    }, 1000); 
    let currentCanvas = document.createElement("canvas");
    currentCanvasContext = currentCanvas.getContext("2d");
    currentCanvasContext.drawImage(canvas, 0, 0, videoWidth, videoHeight);
    imageContainer.className = "photo";
    imageContainer.appendChild(removeImage);
    imageContainer.appendChild(saveImage);
    imageContainer.appendChild(currentCanvas);
    galleryBarContainer.appendChild(imageContainer);
}

function saveSnapshot() {
    //get the canvas data as a data url
    var dataURL = canvas.toDataURL(Date.now() + ".png");
    //create a link to the data url
    var link = document.createElement("a");
    //set the link href to the data url
    link.href = dataURL;
    //set the link download attribute to the current date and time
    link.download = new Date().toISOString();
    //add the link to the document
    document.body.appendChild(link);
    //click the link to trigger the download
    link.click();
    //remove the link from the document
    document.body.removeChild(link);
}

function deleteSnapshot(){
    //clear the canvas image
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}


//create a function that pause the video
function pauseVideo() {
    video.pause();
}

function startVideo(){
    //create a function to start the video
    video.play()
}
