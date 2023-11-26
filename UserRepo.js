const DBConnection = require('./DBConnection');

class UserRepo {
    static instance;

    #log;
    constructor(log) {
        if (UserRepo.instance) {
            return UserRepo.instance;
        }
        this.db = new DBConnection().getConnection();
        this.#log = log;
        UserRepo.instance = this;
    }

    checkIfUserTableExists() {
        // let tbExists = false;
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='User';`,
                (err, row) => {
                    if (err){
                        this.#log.log('Error checking if table User exists');
                        this.#log.log(err.message);
                        reject('error');
                    }
                    if (row) {
                        this.#log.log('Table User already exists');
                        resolve(true);
                    } else {
                        this.#log.log('Table User does not exist');
                        resolve(false);
                    }
            });
        });
    }

    checkIfUserExists(name) {
        var sql = db.prepare(`SELECT name FROM User WHERE name = ?`);
        return new Promise((resolve, reject) => {
            sql.get([name],
                (err, row) => {
                    if (err){
                        this.#log.log('Error checking if user exists');
                        this.#log.log(err.message);
                        reject('error');
                    }
                    if (row) {
                        this.#log.log('User already exists');
                        resolve(true);
                    } else {
                        this.#log.log('User does not exist');
                        resolve(false);
                    }
            });
        });
    }

    createUserTable() {
        this.#log.log('Creating table User');
        var sql = this.db.prepare(`
            CREATE TABLE IF NOT EXISTS User (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                password TEXT,
                email TEXT,
                failed_logins INTEGER,
                disabled INTEGER,
                timestamp_account_created TEXT DEFAULT CURRENT_TIMESTAMP,
                is_admin INTEGER,
                key TEXT
            )
        `);
        return new Promise((resolve, reject) => {
            sql.run([], (err) => {
                if (err) {
                    this.#log.log('Error creating table User');
                    this.#log.log(err.message);
                    reject(err);
                } else {
                    this.#log.log('Table User created');
                    resolve(true);
                }
            });
        });
    }

    addUser(user) {
        return new Promise((resolve, reject) => {
            const sql = this.db.prepare('INSERT INTO User (name, password, email, failed_logins, disabled, is_admin, key) VALUES (?, ?, ?, ?, ?, ?, ?)');
            sql.run([user.getName(), user.getPassword(), user.getEmail(), user.getLoginFailedAttempts(), user.getIsDisabled(), user.getIsAdmin(), user.getKey()], (err) => {
                if (err) {
                    this.#log.log('Error adding user');
                    this.#log.log(err.message);
                    reject(err);
                } else {
                    this.#log.log(`User ${user.getName()} added`);
                    resolve(true);
                }
            });
        });
    }

    findUserByName(name) {
        const sql = db.prepare('SELECT * FROM User WHERE name = ?');
        return new Promise((resolve, reject) => {
            this.db.get(sql, [name], (err, row) => {
                if (err) {
                    this.#log.log('Error finding user');
                    this.#log.log(err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // check if there is at least one admin user
    checkIfAdminUserExists() {
        const sql = db.prepare('SELECT * FROM User WHERE is_admin = 1');
        return new Promise((resolve, reject) => {
            sql.get((err, row) => {
                if (err) {
                    // issue with the database
                    this.#log.log('Error checking if admin user exists');
                    this.#log.log(err.message);
                    reject(err);
                } else if (row) {
                    // there is at least one admin
                    resolve(true);
                } else {
                    // no admin user
                    resolve(false);
                }
            });
        });
    }
}

module.exports = UserRepo;