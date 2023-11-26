const DBConnection = require('./DBConnection');

class DBRepo {
  #dbFile;
  #dbConnection

  constructor() {
    this.#dbConnection = new DBConnection().connect();
  }

  add(table, record) {
    this.#dbConnection.run(`INSERT INTO ${table} VALUES (${record})`);
  }

  delete() {
  }

  update() {
  }
}

dbRepo = new DBRepo("./db.sqlite");
dbRepo.add("users", "1, 'John', 'Doe'");