const CollabServer = require('@pdftron/collab-server').default;
const express = require('express');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const open = require('open');
const annotationHandler = require('./annotationHandler');

const server = new CollabServer({
  resolvers: {
    Query: {},
    Mutation: {},
  },
});

app.use(bodyParser.text());
app.use(express.static('client'));
server.start(8000);
app.listen(port, '0.0.0.0', () => {
  console.info(`Server listening at port ${port}`);
  open('http://localhost:3000/index.html');
});

// annotationHandler(app);
