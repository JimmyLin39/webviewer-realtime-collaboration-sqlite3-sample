const CollabServer = require('@pdftron/collab-server').default;
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const open = require('open');
const annotationHandler = require('./annotationHandler');

const corsOption = {
  origin: true,
  credentials: true,
};
const server = new CollabServer({
  resolvers: {
    Query: {},
    Mutation: {},
  },
  logLevel: CollabServer.LogLevels.INFO,
  corsOption,
});

app.use(bodyParser.text());
// app.use(express.static('client'));
server.start(port);
// app.listen(port, '0.0.0.0', () => {
//   console.info(`Server listening at port ${port}`);
//   open('http://localhost:3000/index.html');
// });

// annotationHandler(app);
