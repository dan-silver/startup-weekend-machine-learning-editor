function getPixelData() {
    var img = $(".thumb")[$(".thumb").length -1 ];
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    for (i = 0; i < canvas.height; i++) { 
        for(j = 0; j < canvas.width; j++) {
            var pixelData = canvas.getContext('2d').getImageData(j, i, 1, 1).data;
            console.log(pixelData);
        } 
    }
}