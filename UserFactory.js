const User = require("./User.js");

class UserFactory {
    static async createUser(log, name, password, email, failedLogins, isAdmin, isBlocked, key) {
        try {
            var user = new User(log);
            user = await user.setName(name);
            user = await user.setPassword(password);
            user = await user.setEmail(email);
            user = await user.setLoginFailedAttempts(failedLogins);
            user = await user.setIsAdmin(isAdmin);
            user = await user.setIsBlocked(isBlocked);
            user = await user.setKey(key); 
            return user;
        } catch(err) {
            throw new Error(err);
        }
    }

    constructor() {
        if (this instanceof UserFactory) {
            throw new Error("A static class cannot be instantiated.");
        }
    }
}

module.exports = UserFactory;
