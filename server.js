const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 5500;

const server = http.createServer((req, res) => {
    console.log('Request for ' + req.url + ' by method ' + req.method);

    if (req.method == 'GET') {
        var fileUrl;
        if (req.url == '/') fileUrl = '/index.html';
        else fileUrl = req.url;

        var filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath);
        if (fileExt == '.html') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    filePath = path.resolve('./public/404.html');
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    fs.createReadStream(filePath).pipe(res);
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.css' || fileExt == '.map') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/css');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.js') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/javascript');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.svg') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/svg+xml');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.jpg') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/jpg');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.mp3') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'audio/mpeg');
            fs.createReadStream(filePath).pipe(res);
        }
        else {
            filePath = path.resolve('./public/404.html');
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filePath).pipe(res);
        }
    }
    else {
        filePath = path.resolve('./public/404.html');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res);
    }
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});