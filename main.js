let flashActive = false;
let switchValue = 0;
let cameras = [];
window.onload = function () {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            alert("An error occurred: " + err);
        });
}

let controls = document.getElementById("controls");
//create a function called snapshot that takes the video and output it to the canvas as a snapshot
function snapshot() {
    let videoWidth = document.getElementById("video").videoWidth;
    let videoHeight = document.getElementById("video").videoHeight;
    let galleryBarContainer = document.getElementById('gallery-container');
    var context = canvas.getContext("2d");
    let removeImage = document.createElement("i");
    let saveImage = document.createElement("i");
    let editImage = document.createElement("i");
    let imageContainer = document.createElement("div")
    let galeryOptionsContainer = document.createElement('div');
    let galleryBar = document.getElementById("gallery-bar");
    galeryOptionsContainer.className = 'galery-options-container'
    removeImage.className = "fas fa-trash-alt";
    saveImage.className = "fas fa-save";
    editImage.className = "fas fa-edit"
    //set a canvas height and width to the video height and width without ruining the aspect ratio 
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    canvas.style.objectFit = 'none';
    //draw the video to the canvas
    //draw the video to the canvas
    //if flash active is true then activate the flash
    if (flashActive == true) {
        activateFrontFlash();
        setTimeout(function () {
            canvas.style.objectFit = 'contain';
            context.drawImage(video, 0, 0, videoWidth, videoHeight);
        }, 800);
        //if flash active is false then deactivate the flash
    } else if (flashActive == false) {
        canvas.style.objectFit = 'contain';
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        flashAcive = true;
    }
    //add a animate.css animation to the canvas 
    canvas.classList.add("animated", "fadeIn");
    //wait for the animation to finish and then remove the class
    setTimeout(function () {
        canvas.classList.remove("animated", "fadeIn");
    }, 1200);
    let currentCanvas = document.createElement("canvas");
    currentCanvasContext = currentCanvas.getContext("2d");
    currentCanvasContext.drawImage(canvas, 0, 0, videoWidth, videoHeight);
    currentCanvas.className = "savedCanvas";
    imageContainer.className = "photo";
    galeryOptionsContainer.appendChild(removeImage);
    galeryOptionsContainer.appendChild(saveImage);
    galeryOptionsContainer.appendChild(editImage);
    imageContainer.appendChild(currentCanvas);
    imageContainer.appendChild(galeryOptionsContainer);
    galleryBarContainer.appendChild(imageContainer);
    galleryBar.scrollTop = galleryBar.scrollHeight;
    galleryBar.scrollRight = galleryBar.scrollWidth;
}
function resizeCanvas() {
    //this function activates when canvas button is clicked
    //add a class of active to the canvas when clicked
    //and remove it when clicked again
    canvas.classList.toggle("active");
    //if the canvas has the class active
    if (canvas.classList.contains("active") && canvas.style.objectFit == 'contain') {
        //add a class of active to the canvas
        canvas.classList.add("active");
        canvas.style.objectFit = 'contain';
    }
    else {
        //remove the class of active from the canvas
        canvas.classList.remove("active");
    }
}
function frontFlash() {
    //create a function to activate the front flash
    let noFlashIndicator = document.getElementById("no-flash-indicator");
    let frontFlashIndicator = document.getElementById("front-flash-indicator");
    flashActive = true;
    frontFlashIndicator.className = "active-indicator"
    noFlashIndicator.className = ""
}
function noFlash() {
    let noFlashIndicator = document.getElementById("no-flash-indicator");
    let frontFlashIndicator = document.getElementById("front-flash-indicator");
    flashActive = false;
    noFlashIndicator.className = "active-indicator";
    frontFlashIndicator.className = "";
}
function activateFrontFlash() {
    let flash = document.getElementById('front-flashlight')
    flash.classList.toggle("flash-active");
    flash.classList.add("animated", "fadeIn");
    //if the canvas has the class active
    if (flash.classList.contains("flash-active")) {
        //add a class of active to the canvas
        flash.classList.add("flash-active");

        setTimeout(function () {
            setTimeout(function () {
                flash.classList.remove("animated", "fadeIn");
                flash.classList.remove("flash-active");
            }, 400);
            flash.classList.add("animated", "fadeOut");

        }, 800);
        flash.classList.remove("animated", "fadeOut");
    }
}
function saveSnapshot() {
    if (canvas.style.objectFit != 'contain') {
        alertSystem(takePictureFirst)
    } else {
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
}

takePictureFirst = document.createElement("div");
takePictureFirst.className = "alert";
takePictureFirst.innerHTML = 'HELLO';
function alertSystem(alert) {
    let alertHolder = document.getElementById("alert-holder");
    alertHolder.appendChild(alert);
    setTimeout(function () {
        alertHolder.style.display = 'flex'
        setTimeout(function () {
            alertHolder.classList.remove("animated", "fadeIn");

            alertHolder.style.display = "none"
        }, 400);
        alertHolder.classList.add("animated", "fadeOut");
    }, 800);

}

//create a function to start recording video from the video element
function switchCamera() {
    if (switchValue == 0) {
        switchValue = 1;
    } else {
        switchValue = 0;
    }
    //create a function to switch between cameras in mobile devices
    //get the different cameras on the device using user gete media stream with devices
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
        //loop through the different cameras on the device
        devices.forEach(function (device) {
            //if the device is a video input
            if (device.kind === "videoinput" && device.label != "" && cameras != undefined) {
                if (cameras.includes(device.deviceId)) {
                    console.log("")
                } else {
                    cameras.push(device.deviceId);
                    console.log(cameras);
                }
            }
        });
    })
    .then(function () {
        if (cameras.length > 1) {
            navigator.mediaDevices.getUserMedia({ video: true, deviceId: cameras[switchValue], audio: false })
                .then(function (stream) {
                    video.srcObject = stream;
                    video.play();
                })
                .catch(function (err) {
                    alert("An error occurred: " + err);
                });
        } else {
            console.log("you have only one camera available")
        }
    }); //end of the mediaDevices.enumerateDevices function
}


function deleteSnapshot() {
    //clear the canvas image
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.objectFit = 'none';
    if (canvas.classList.contains("active")) {
        resizeCanvas()
    }
}

//create a function that pause the video
function pauseVideo() {
    video.pause();
}

function startVideo() {
    //create a function to start the video
    video.play()
}
