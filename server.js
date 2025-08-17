const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.txt': 'text/plain',
  '.css': 'text/css',
};

const server = http.createServer((req, res) => {
  let filePath = '.' + decodeURIComponent(req.url);
  if (filePath === './') filePath = './index.html';
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not found');
    } else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(content);
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
