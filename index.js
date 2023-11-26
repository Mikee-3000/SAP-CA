require('dotenv').config()
const express = require('express')
const app = express()
const Log = require('./Log.js');
const UserRepo = require('./UserRepo.js');
const User = require('./User.js');
const DBConnection = require('./DBConnection.js');
const Config = require('./Config.js');


// Startup 

// load data from .env file into the config object
const config = new Config(process.env.PORT, process.env.DB_FILE, process.env.MAX_LEN_NAME);
const port = config.getPort();
// the log instance is injected into the DBConnection, UserRepo and other instances
const log = new Log();
// start DBCOnnection
db = new DBConnection(log).getConnection();
// create the UserRepo instance
const userRepo = new UserRepo(log);
// check if the user table exists, create it if not
// the db.get call is asynchronous, so we need to wait for it to complete
const userTableExists = userRepo.checkIfUserTableExists().then(tbExists => {
  if (tbExists) {
    log.log('Table User already exists');
  } else {
    log.log('Table User does not exist');
    const firstPassword = User.generateRandomPassword();
    userRepo.createUserTable().then((res) => {
      if (res===true) {
        log.log('Table User created');
        userRepo.checkIfUserExists('admin').then(userExists => {
          if (userExists) {
            log.log('User Admin already exists');
          } else {
            log.log('User Admin does not exist');
            const firstAdmin = new User(log, 'admin', firstPassword, 'admin@localhost', 1, 0);
            log.log(`Creating first admin user with password ${firstPassword}. Please change this password after logging in.`); 
          }
        });
      };
    });
  }
}).catch(err => {
  log.log(err);
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// start the server
app.listen(port, () => {
  log.log(`Example app listening on port ${port}`);
  log.getEntries().forEach((entry) => {
    console.log(entry);
  }); 
});
