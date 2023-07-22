const express = require('express');
const helmet = require('helmet');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
   
  server.use(helmet({
    contentSecurityPolicy: false,  // Disable default CSP from helmet
    crossOriginEmbedderPolicy: true,   // Enable COEP
    crossOriginOpenerPolicy: { sameOrigin: true },  // Enable COOP
  }));
 
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000')
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
