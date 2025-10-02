import Database from "better-sqlite3";

const db = new Database("data.db");

export const startSession = function () {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS session (
        user_id TEXT
  )    
`
  ).run();

  db.prepare(
    `
  CREATE TABLE IF NOT EXISTS entries (
    id TEXT,
    date TEXT,
    text TEXT,
    mood TEXT,
    tags TEXT,
    user_id TEXT NULL,
    isSynced BOOLEAN DEFAULT 0
  )
`
  ).run();
};

export default db;
