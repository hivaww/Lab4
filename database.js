const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database(":memory:");
//const allUsers = [];

function initial() {
  database.serialize(() => {
    database.run(
      "CREATE TABLE Users (userID TEXT, name TEXT, role TEXT, password TEXT)"
    );
    const dp = database.prepare("INSERT INTO Users VALUES (?,?,?,?)");
    dp.run(`id1`, `user1`, `student`, `pasword`);
    dp.run(`id2`, `user2`, `student`, `pasword`);
    dp.run(`id3`, `user3`, `student`, `pasword`);
    dp.run(`admin`, `admin`, `admin`, `admin`);
    dp.finalize();
  });
}

function userData(req, pass) {
  const state = database.prepare("INSERT INTO Users VALUES (?,?,?,?)");
  state.run(
    `${req.body.userID}`,
    `${req.body.name}`,
    `${req.body.role}`,
    `${pass}`
  );
  console.log("Data has been added");
}

function getData() {
  database.all("SELECT * FROM Users", (err, row) => {
    if (err) {
      console.log(err);
    } else {
      console.log(row, row.length);
      return row;
    }
  });
}

function getPassword(username) {
  return new Promise((resolve, reject) => {
    database.each(
      "SELECT password FROM Users WHERE userID LIKE ?",
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
          console.log("row: ", row.password);

          return row.password;
        }
      }
    );
  });
}

module.exports = { initial, userData, getData, getPassword };
