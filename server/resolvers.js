const fs = require('fs');
const { get } = require('http');
const sqlite3 = require('sqlite3').verbose();

const initDatabaseQuery = fs
  .readFileSync(`${__dirname}/init_database.sql`)
  .toString();

// Create and initialize database
if (!fs.existsSync('server/collab.db')) {
  fs.writeFileSync('server/collab.db', '');
}
// Connect to SQLite database
const db = new sqlite3.Database('./collab.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('🚀 Connected to the in-memory SQlite database.');
});
const dataArr = initDatabaseQuery.split(');');
db.serialize(() => {
  // db.run runs your SQL query against the DB
  db.run('PRAGMA foreign_keys = ON;');
  // Loop through the `dataArr` and db.run each query
  dataArr.forEach(query => {
    if (query) {
      // Add the delimiter back to each query before you run them
      // In this case the it was `);`
      const restoredQuery = `${query});`;
      db.run(restoredQuery, err => {
        if (err) throw err;
      });
    }
  });
});

const getQueryResponse = (functionName, query, param) => {
  console.log(`${functionName} - ${query},`, param);
  return new Promise((resolve, reject) => {
    db.all(query, param, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

module.exports = {
  Query: {
    user: async id => {
      const res = await getQueryResponse(
        'Query.user',
        `SELECT * FROM users WHERE id = ?`,
        [id]
      );
      return res[0] || null;
    },
    annotation: async id => {
      const res = await getQueryResponse(
        'Query.annotation',
        `SELECT * FROM annotations WHERE id = ?`,
        [id]
      );
      return res[0] || null;
    },
    document: async id => {
      const res = await getQueryResponse(
        'Query.document',
        `SELECT * FROM documents WHERE id = ?`,
        [id]
      );
      return res[0] || null;
    },
    annotationMember: async (annotId, userId, memberId) => {
      if (memberId) {
        const resWithMemberId = await getQueryResponse(
          'Query.annotationMember',
          `SELECT * FROM annotationMembers WHERE id = ?`,
          [memberId]
        );
        return resWithMemberId[0] || null;
      }
      const res = await getQueryResponse(
        'Query.annotationMember',
        `SELECT * FROM annotationMembers WHERE userId = ? AND annotationId = ?`,
        [userId, annotId]
      );
      return res[0] || null;
    },
    userDocuments: async userId => {
      const res = await getQueryResponse(
        'Query.userDocuments',
        `SELECT * FROM documents WHERE id IN ( SELECT documentId AS id FROM documentMembers WHERE userId = ?)`,
        [userId]
      );
      return res;
    },
  },
  Mutation: {
    addUser: async user => {
      const res = await getQueryResponse(
        'Mutation.addUser',
        `
          INSERT INTO users
          (id, type, email, userName, createdAt)
          VALUES
          (?, ?, ?, ?, ?)
        `,
        [user.id, user.type, user.email, user.userName, user.createdAt]
      );
      return res[0] || null;
    },
    addDocument: async doc => {
      const res = await getQueryResponse(
        'Mutation.addDocument',
        `
          INSERT INTO documents
          (id, createdAt, authorId, isPublic, name)
          VALUES
          (?, ?, ?, ?, ?)
        `,
        [doc.id, doc.createdAt, doc.authorId, doc.isPublic, doc.name]
      );
      return res[0] || null;
    },
  },
};
