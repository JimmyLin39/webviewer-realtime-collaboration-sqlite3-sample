CREATE TABLE IF NOT EXISTS users (
  id TEXT NOT NULL PRIMARY KEY,
  userName TEXT,
  email TEXT,
  password TEXT,
  status TEXT,
  type TEXT,
  customData TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT
  authorId TEXT NOT NULL,
  FOREIGN KEY (authorId)
      REFERENCES users (id)
  isPublic INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
);

CREATE TABLE IF NOT EXISTS annotations (
  id TEXT NOT NULL PRIMARY KEY,
  xfdf TEXT,
  authorId TEXT NOT NULL,
  FOREIGN KEY (authorId)
      REFERENCES users (id)
  documentId TEXT NOT NULL,
  FOREIGN KEY (documentId)
      REFERENCES documents (id)
      ON DELETE CASCADE,
  pageNumber INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  inReplyTo TEXT
);

CREATE TABLE IF NOT EXISTS annotationMembers (
  id TEXT NOT NULL PRIMARY KEY,
  userId TEXT REFERENCES users (id),
  documentId TEXT NOT NULL,
  FOREIGN KEY (documentId)
      REFERENCES documents (id)
      ON DELETE CASCADE,
  annotationId TEXT NOT NULL,
  FOREIGN KEY (annotationId)
      REFERENCES annotations (id)
      ON DELETE CASCADE,
  lastRead INTEGER,
  permission TEXT
);

CREATE TABLE IF NOT EXISTS documentMembers (
  id TEXT NOT NULL PRIMARY KEY,
  userId TEXT REFERENCES users (id),
  documentId TEXT NOT NULL,
  FOREIGN KEY (documentId)
      REFERENCES documents (id)
      ON DELETE CASCADE,
  lastRead INTEGER NOT NULL
);
