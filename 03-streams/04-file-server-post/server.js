const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const MEGIBITE = 1000000;

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode=400;
        res.end();
        return;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
        return;
      }

      const limitedStream = new LimitSizeStream({limit: MEGIBITE});
      const writeStream = fs.createWriteStream(filepath);
      let isFileLoaded = false; // я думаю должно быть более лакончиное решение?

      limitedStream.on('error', ()=>{
        fs.unlink(filepath, (err) => {
          if (err) throw err;

          res.statusCode = 413;
          res.end();
          return;
        });
      });

      req.pipe(limitedStream).pipe(writeStream);

      writeStream.on('finish', ()=>{
        isFileLoaded = true;
        res.statusCode = 201;
        res.end();
      });

      req.on('close', (...args)=>{
        limitedStream.destroy();

        if (!isFileLoaded) {
          fs.unlink(filepath, (err) => {
            if (err) throw err;

            res.statusCode = 500;
            res.end();
            return;
          });
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
