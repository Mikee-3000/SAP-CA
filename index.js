require('dotenv').config()
const express = require('express')
const app = express()
const Log = require('./Log.js');
const LogRepo = require('./LogRepo.js');
const UserRepo = require('./UserRepo.js');
const User = require('./User.js');
const UserFactory = require('./UserFactory.js');
const DBConnection = require('./DBConnection.js');
const Config = require('./Config.js');


// Startup --------------------------------------------------------------------

// load data from .env file into the config object
const config = new Config(process.env.PORT, process.env.DB_FILE, process.env.MAX_LEN_NAME);
const port = config.getPort();

// initiate logging
// the log instance is injected into the DBConnection, UserRepo and other instances
const log = new Log();

// start DBConnection
db = new DBConnection(log).getConnection();

const logRepo = new LogRepo(log); 

// check if the log table exists, create it if not
const logTableExists = logRepo.checkIfLogTableExists().then(tbExists => {
  if (!tbExists) {
    return logRepo.createLogTable().then((res) => {
      if (res===true) {
        log.log('Table Log created');
      };
    });
  }
}).then(() => {
  // now we can add connection to the log and it can start saving entries in the db
  log.addConnection(db);
}).catch(err => {
  log.log(err);
});


// create the UserRepo instance
const userRepo = new UserRepo(log);

// check if the user table exists, create it if not
// the db.get call is asynchronous, so we need to wait for it to complete
const userTableExists = userRepo.checkIfUserTableExists().then(tbExists => {
  if (!tbExists) {
    const firstPassword = User.generateRandomPassword();
    return userRepo.createUserTable().then((res) => {
      if (res===true) {
        log.log('Table User created');
      };
    });
  }
}).then(() => {
  // check if the admin user exists, create it if not
  return userRepo.checkIfAdminUserExists().then(userExists => {
    if (!userExists) {
      const firstPassword = User.generateRandomPassword();
      const firstAdmin = UserFactory.createUser(log, 'admin', firstPassword, 'admin@localhost', 1, 0);
      log.log(`\nCreating first admin user with the following password:\n-------------------\n${firstPassword}\n-------------------\nPlease change this password and preferably the name and email after logging in.\n`); 
    }
  });
}).catch(err => {
  log.log(err);
});


// Routes ---------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// start the server
app.listen(port, () => {
  log.log(`App listening on port ${port}`);
});
