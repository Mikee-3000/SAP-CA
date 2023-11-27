const DBConnection = require("./DBConnection");

class LogRepo {
  constructor(log) {
    this.db = new DBConnection(log).getConnection();
  }

  checkIfLogTableExists() {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='Log';`,
        (err, row) => {
          if (err) {
            reject("error");
          }
          if (row) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }

  saveLogEntry(time, message) {
    var sql = this.db.prepare(
      `INSERT INTO Log (timestamp, message) VALUES (?, ?)`
    );
    return new Promise((resolve, reject) => {
      sql.run([time, message], (err) => {
        if (err) {
          reject("error");
        }
        resolve(true);
      });
    });
  }

  createLogTable() {
    var sql = this.db.prepare(`
            CREATE TABLE Log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                message TEXT NOT NULL
            );
        `);
    return new Promise((resolve, reject) => {
      sql.run([], (err) => {
        if (err) {
          reject("error");
        }
        resolve(true);
      });
    });
  }
}

module.exports = LogRepo;
