function getPixelData() {
    var img = $(".thumb")[$(".thumb").length -1 ];
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    var pixels = [];

    for (i = 0; i < canvas.height; i++) { 
        for(j = 0; j < canvas.width; j++) {
            var rawPixelData = canvas.getContext('2d').getImageData(j, i, 1, 1).data;
            var grayscalePixel = rawPixelData[0] * 0.21 + rawPixelData[1] * 0.72 + rawPixelData[2] * 0.07;
            pixels.push(Math.round(grayscalePixel).toString());
        }
    }

    console.log(pixels);
}