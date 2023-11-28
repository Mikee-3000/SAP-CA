const DBConnection = require('./DBConnection');
const LogRepo = require('./LogRepo');

class Log {
    #logEntries;
    #db;
    #logRepo;

    constructor() {
        this.#logEntries = [];
        this.#db = null;
    }

    addConnection(db) {
        this.#logRepo = new LogRepo(this);
        this.#db = db;
        // at first there is no connection, but once we have it, we can save the entries
        return new Promise((resolve, reject) => {
            this.#logEntries.forEach((entry) => {
                if (!entry.savedInDb) {
                    this.#logRepo.saveLogEntry(entry.time, entry.message).then(() => {
                        entry.savedInDb = true;
                    });
                }
            });
            resolve(true);
        });
    }

    addEntry(time, message) {
        return new Promise((resolve, reject) => {
            this.#logEntries.push({ 'time': time, 'message': message, 'savedInDb': false });
            if (this.#db != null) {
                // this.#db.run(`INSERT INTO Log (timestamp, message) VALUES (?, ?)`, [time, message], (err) => {
                this.#logRepo.saveLogEntry(time, message).then(() => {
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    }

    getEntries() {
        return this.#logEntries;
    }

    log(message) {
        const time = new Date().toISOString();
        this.addEntry(time, message).then(() => {
            console.log(time, message);
        });
    }
}

module.exports = Log;