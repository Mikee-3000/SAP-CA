const sqlite3 = require("sqlite3").verbose();
const Config = require("./Config.js");

class DBConnection {
  #connection;
  // log is a injected from the main app
  #log;
  #databasePath;
  #config;
  constructor(log) {
    // this is a singleton, return an instance if it exists
    if (DBConnection.instance) {
      return DBConnection.instance;
    }
    // otherwise, create a new instance
    // bring in the config
    this.#config = new Config();
    this.#databasePath = this.#config.getDbFile();
    this.#log = log;
    this.#connection = null;

    DBConnection.instance = this;
  }

  getConnection() {
    if (this.#connection) {
      return this.#connection;
    }

    this.#connection = new sqlite3.Database(this.#databasePath, (err) => {
      if (err) {
        this.#log.log("Error connecting to DB");
      } else {
        this.#log.log("Started a new connection to the database.");
      }
    });

    return this.#connection;
  }
}

module.exports = DBConnection;
