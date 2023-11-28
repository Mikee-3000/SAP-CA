const User = require("./User.js");

class UserFactory {
  static createUser(log, name, password, email, isAdmin, isDisabled) {
    return new User(log, name, password, email, isAdmin, isDisabled);
  }
  constructor() {
    if (this instanceof UserFactory) {
      throw new Error("A static class cannot be instantiated.");
    }
  }
}

module.exports = UserFactory;
