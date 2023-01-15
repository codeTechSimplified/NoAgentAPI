const http = require('http');
const app = require('./App.js');
const port = process.env.PORT || 8000;

const server = http.createServer(app);
server.listen(port);

