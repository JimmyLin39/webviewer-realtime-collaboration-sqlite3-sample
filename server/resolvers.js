const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const initDatabaseQuery = fs
  .readFileSync(`${__dirname}/init_database.sql`)
  .toString();

// Create and initialize database
if (!fs.existsSync('server/collab.db')) {
  fs.writeFileSync('server/collab.db', '');
}
const db = new sqlite3.Database('./collab.db');
db.serialize(() => {
  db.run(initDatabaseQuery);
});

module.exports = {
  Query: {
    user: id => {
      db.all(`SELECT * FROM users WHERE id=${id}`, (err, rows) => rows);
    },
  },
  Mutation: {
    addUser: user => {
      db.all(
        `
        INSERT INTO users
        (id, type, email, userName, createdAt)
        VALUES
        (${user.id}, ${user.email}, ${user.userName}, ${user.createdAt})
      `,
        (err, rows) => rows
      );
    },
  },
};
