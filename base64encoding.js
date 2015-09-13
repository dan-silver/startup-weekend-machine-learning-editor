function getPixelData() {
    var img = $(".thumb")[$(".thumb").length -1 ];
    var canvas = document.createElement('canvas');
    canvas.width = 28;//img.width;
    canvas.height = 28;//img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    var pixels = [];

    for (i = 0; i < canvas.height; i++) { 
        for(j = 0; j < canvas.width; j++) {
            var rawPixelData = canvas.getContext('2d').getImageData(j, i, 1, 1).data;
            var grayscalePixel = rawPixelData[0] * 0.21 + rawPixelData[1] * 0.72 + rawPixelData[2] * 0.07;
            pixels.push(Math.round(grayscalePixel).toString());
        }
    }

    return pixels;
}