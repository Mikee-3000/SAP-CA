const User = require("./User.js");
const UserRepo = require("./UserRepo.js");
const UserFactory = require("./UserFactory.js");


class UserService {

    constructor() {
    }

    static async saveNewUserToDB(log, user) {
        let exists = await new UserRepo(log).checkIfUserExists(user.getName());
        if (exists) {
          throw new Error("User already exists");
        }
        try {
          await new UserRepo(log).addUser(user);
        } catch (err) {
          throw new Error(err);
        }
    };

    static async updateExistingUser(log, user) {
        try {
          await new UserRepo(log).updateUser(user);
        } catch (err) {
          throw new Error(err);
        }
    }

    static async findUserByName(log, name) {
      log.log(`Finding user ${name}`);  
      let userRow = await new UserRepo(log).findUserByName(name);
      if (!userRow) {
        log.log(`User ${name} not found`);
        return false;
      }
      log.log(`User ${userRow.name} found`)
      const user = await UserFactory.createUser(
        log,
        userRow.name,
        userRow.password,
        userRow.email,
        userRow.failed_logins,
        userRow.is_admin,
        userRow.blocked,
        userRow.key
      );
      // log.log(`User ${user.getName()} created`);
      return user;
    }
}

module.exports = UserService;