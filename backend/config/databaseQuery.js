const db = require("./db");

const databaseQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, data) => {
      if (error) {
        return reject(error);
      }

      return resolve(data);
    });
  });
};

module.exports = databaseQuery;
