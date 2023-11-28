const DBConnection = require('./DBConnection');
const UserRepo = require('./UserRepo.js');
const Config = require('./Config.js');
const bcrypt = require('bcrypt');

var generator = require('generate-password');
const options = {
    numbers: true,
    length: 10,
};

class User {
    #name;
    #email;
    #password;
    #isAdmin;
    #isBlocked;
    #loginFailedAttempts;
    #log;
    #key;
    #db;
    #userRepo;
    #config;

    static generateRandomPassword() {
        const password = generator.generate(options);
        return password;
    }

    constructor(log) {
        this.#log = log;
        this.#userRepo = new UserRepo(log);
        this.#config = new Config();
    };

    async validatePassword(passw) {
        const minLen = 8;
        const maxLen = 64;
        // check length
        if (passw.length < minLen || passw.length > maxLen) {
            this.#log.log("Password length is invalid");
            throw new Error('invalid password');
        }
        // check for 3 or more of the same characters
        const threeChar = /(.)\1\1/;
        if (threeChar.test(passw)) {
            this.#log.log("Password contains 3 or more of the same characters");
            throw new Error('invalid password');
        }
        // check for 3 or more consecutive numbers
        const threeNum = /012|123|234|345|456|567|678|789/;
        if (threeNum.test(passw)) {
            this.#log("Password contains 3 or more consecutive numbers");
            throw new Error('invalid password');
        }
        this.#log.log("Password is valid");
        return true;
    }
    hashPassword(passw) {
        const saltRounds = 10;
        return bcrypt.hashSync(passw, saltRounds);
    }
    async checkIfUserExists(uName) {
        let userExists = await this.#userRepo.checkIfUserExists(uName);
        if (userExists) {
            return true;
        }
        return false;
    }
    validateUserName(uName) {
        this.#log.log(`Validating username ${uName}`);
        return new Promise((resolve, reject) => {
            if (uName === undefined || uName === null) {
                reject("Username is undefined or null");
            } else {
                let mln = this.#config.getMaxLenName(); 
                const pattern = `^[a-z][-a-z_0-9]{4,${mln}}$`;
                const regex = new RegExp(pattern);
                if (regex.test(uName)) {
                    this.#log.log(`Username ${uName} is valid`);
                    resolve(true);
                } else {
                    reject("Username is invalid");
                }   
            }
        });
    }

    async setName(name) {
        try {
            let validate = await this.validateUserName(name);
            this.#name = name;
            return this;
        } catch(err) {
            throw new Error(err);
        }
    }

    getName() {
        return this.#name;
    }

    async setPassword(password) {
        try {
            let valid = await this.validatePassword(password);
            this.#password = this.hashPassword(password);
            return this;
        } catch(err) {
            throw new Error(err);
        };
    }

    getPassword() {
        return this.#password;
    }

    async setEmail(email) {
        this.#email = email;
        return this;
    }

    getEmail() {
        return this.#email;
    }

    async setIsAdmin(isAdmin) {
        this.#isAdmin = isAdmin;
        return this;
    }

    getIsAdmin() {
        return this.#isAdmin;
    }

    async setKey(key) {
        this.#key = key;
        return this;
    }

    getKey() {  
        return this.#key;
    }

    async deleteKey() {
        this.#key = null;
        resolve(this);
    }

    listQA() {
    }

    saveQA() {
    }

    deleteQA() {
    }

    deleteThisUser() {
    }

    async setIsBlocked(isBlocked) {
        this.#isBlocked = isBlocked;
        return this;
    }

    getIsBlocked() {
        return this.#isBlocked;
    }

    async setLoginFailedAttempts(loginFailedAttempts) {
        this.#loginFailedAttempts = loginFailedAttempts;
        return this;
    }

    getLoginFailedAttempts() {
        return this.#loginFailedAttempts;
    }
}

module.exports = User;