const DBConnection = require('./DBConnection');
const UserRepo = require('./UserRepo.js');
const Config = require('./Config.js');
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
    #isDisabled;
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

    constructor(log, name, password, email, isAdmin, isDisabled) {
        this.#log = log; // Initialize log as an empty array
        this.#db = new DBConnection().getConnection();  
        this.#name = name;
        this.#password = password;
        this.#email = email;
        this.#isAdmin = isAdmin;
        this.#isDisabled = isDisabled;  
        this.#loginFailedAttempts = 0;
        this.#userRepo = new UserRepo();
        this.#config = new Config();
        if (this.validateUserName()) {
            this.#userRepo.addUser(this).then((res) => {
                if (res===true) {
                    this.#log.log('User added');
                };
            }).catch(err => {
                this.#log.log(err);
            });
            
        }
    }

    validatePassword() {
    }
    validateUserName() {
        return new Promise((resolve, reject) => {
            this.#userRepo.checkIfUserExists(this.#name).then(userExists => {
            if (userExists) {
                this.#log.log('User already exists');
                resolve(false);
            } else {
                this.#log.log(`User ${this.#name} does not exist`);
                let mln = this.#config.getMaxLenName(); 
                const pattern = `^[a-z][-a-z_0-9]{4,${mln}}$`;
                const regex = new RegExp(pattern);
                if (regex.test(this.#name)) {
                    this.#log.log('Username is valid');
                    resolve(true);
                } else {
                    this.#log.log('Username is invalid');
                    resolve(false);
                }   
            }
        });
        }).catch(err => {
            this.#log.log(err);
            return false;
        });
    }

    getName() {
        return this.#name;
    }
    setPassword(password) {
        this.#password = password;
    }
    getPassword() {
        return this.#password;
    }
    setEmail(email) {
        this.#email = email;
    }
    getEmail() {
        return this.#email;
    }
    setIsAdmin(isAdmin) {
        this.#isAdmin = isAdmin;
    }
    getIsAdmin() {
        return this.#isAdmin;
    }
    setKey(key) {
        this.#key = key;
    }
    getKey() {  
        return this.#key;
    }

    deleteKey() {
        this.#key = null;
    }

    listQA() {
    }

    saveQA() {
    }

    deleteQA() {
    }

    deleteThisUser() {
    }

    setIsDisabled(isDisabled) {
        this.#isDisabled = isDisabled;
    }

    getIsDisabled() {
        return this.#isDisabled;
    }

    setLoginFailedAttempts(loginFailedAttempts) {
        this.#loginFailedAttempts = loginFailedAttempts;
    }

    getLoginFailedAttempts() {
        return this.#loginFailedAttempts;
    }
}

module.exports = User;