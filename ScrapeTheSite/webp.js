const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const outputFolder = "./../PWA/res" // Output folder
const PNGImages = "./../PWA/res/*.png" // PNG images
const JPEGImages = "./../PWA/res/*.jpg" // JPEG images

imagemin([JPEGImages], outputFolder, {
    use: [
        imageminWebp({
            quality: 65
        })
    ]
}).then(() => {
    console.log('Jpeg images optimized');
});

imagemin([PNGImages], outputFolder, {
    use: [
        imageminWebp({
            lossless: true // Losslessly encode images
        })
    ]
}).then(() => {
    console.log('Png images optimized');
});