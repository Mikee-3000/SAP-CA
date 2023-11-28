const DBConnection = require("./DBConnection");

class QARepo {
  #log;
  #db;

  constructor(log) {
      this.#log = log;
      this.#db = new DBConnection(log).getConnection();

  }

  QASave(QA, name) {
  }

  QAList(name) {
  }

  QAdelete(id, name) {
  }

  createQATable() {
    var sql = this.#db.prepare(`
            CREATE TABLE QA (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                model TEXT NOT NULL,
                time_asked TEXT NOT NULL
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

  checkIfQATableExists() {
    return new Promise((resolve, reject) => {
      this.#db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='QA';`,
      (err, row) => {
        if (err){
          reject('error');
        }
        if (row) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}

module.exports = QARepo;