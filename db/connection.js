const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path');

let dbInstance;

async function getDB() {
  if (!dbInstance) {
    dbInstance = await sqlite.open({
      filename: path.join(__dirname, '..', 'recipes.db'),
      driver: sqlite3.Database
    });
  }
  return dbInstance;
}

module.exports = getDB;