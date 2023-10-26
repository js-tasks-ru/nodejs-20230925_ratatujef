const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET': {
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode=404;
        res.end();
        console.log(filepath, 'is not exist');
        return;
      }

      fs.access(filepath, fs.constants.R_OK, (error)=>{
        if (error) {
          // не совсем понимаю почему эта ошибка не обрабатывает отсутствие файла
          // (вроде бы явная проверка на доступ к файлу,
          // а если не будет проверки на 21 строке, все падает полностью)
          res.statusCode = 500;
          res.end(error);
        }

        const file = fs.createReadStream(filepath);
        file.pipe(res);

        file.on('error', ()=>{
          res.statusCode = 500;
          res.end(error);
        });

        res.on('close', ()=>{
          file.destroy();
        });
      });

      break;
    }
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
