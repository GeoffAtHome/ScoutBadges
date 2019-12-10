module.exports = {
    "globDirectory": "build/es6-bundled/",
    "globPatterns": [
        "index.html",
        "src/*.js",
        "images/*.png",
        "images/icons/*.png"
    ],
    "swSrc": "sw.js",
    "swDest": "build/es6-bundled/sw.js",
    "globIgnores": [
        "../workbox-config.js"
    ]
};