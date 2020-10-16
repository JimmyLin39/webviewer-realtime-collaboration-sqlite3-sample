const CollabServer = require('@pdftron/collab-server');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const resolvers = require('./resolvers');

const corsOption = {
  origin: true,
  credentials: true,
};

const server = new CollabServer({
  resolvers,
  logLevel: CollabServer.LogLevels.DEBUG,
  corsOption,
});

app.use(bodyParser.text());
server.start(port);
