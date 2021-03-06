const mysql = require('mysql');
require('dotenv').config();


const HOST = process.env.HOST;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DB;

const db = mysql.createConnection({
  host: HOST,
  user: 'root',
  // user: USER,
  password: PASSWORD,
  database: DATABASE,
});

const router = {};

/**
 * Joins params and columns to comma separated string, with quotation marks if necessary
 * Creates query by combining params, columns, and table
 * Executes query to database, console logging results
 * @param {Array} params
 * @param {Array} columns
 * @param {String} table
 * @returns {Function} Promise from post request
 */
router.post = function post(params, columns, table) {
  const attr = params.join("', '");
  const cols = columns.join(',');
  const query = `INSERT INTO ${table} (${cols}) VALUES ('${attr}')`;
  console.log(query);
  return db.query(query, (err, rows) => {
    if (!err) {
      console.log(rows);
    } else {
      console.log(err);
    }
  });
};

/**
 * Creates columns by taking the keys from body
 * Creates params by taking values from body
 * Calls post request to spurrs database with created params and columns
 * Sends 200 status back to client
 * @param {Object} body
 * @param {Object} res
 * @returns {Function} Promise from post request
 */
router.postSpurr = function ({ body }, res) {
  const columns = Object.keys(body);
  const params = columns.reduce((arr, key) => arr.concat([body[key]]), []);
  router.post(params, columns, 'spurrs');
  res.sendStatus(200);
};

/**
 * Creates columns by taking the keys from body
 * Creates params by taking values from body
 * Calls post request to saved_spurrs database with created params and columns
 * Sends 200 status back to client
 * @param {Object} body
 * @param {Object} res
 * @returns {Function} Promise from post request
 */
router.saveSpurr = function ({ body }, res) {
  const columns = Object.keys(body);
  const params = columns.reduce((arr, key) => arr.concat([body[key]]), []);
  router.post(params, columns, 'saved_spurrs');
  res.sendStatus(200);
};

/**
 * Creates query by combining table, limit, and del
 * Executes query to database in a promise
 * Sends data from request in promise resolve
 * @param {String} table
 * @param {Number} limit
 * @param {Boolean} del
 * @returns {Function} Promise from get request
 */
router.get = function get(table, limit, del) {
  const query = `SELECT * FROM ${table} ORDER BY spurr_id ASC LIMIT ${limit}`;
  return new Promise(function (resolve) {
    db.query(query, (err, rows) => {
      if (!err) {
        if (del) {
          resolve(rows[0]);
          const remove = `DELETE FROM ${table} WHERE spurr_id = ${rows[0].spurr_id}`;
          db.query(remove);
        } else {
          resolve(rows);
        }
      } else {
        console.log(err);
      }
    });
  });
};

/**
 * Calls get request to spurrs database
 * Specifies to get 1 spurr
 * Specifies to delete the received spurr from the database after obtaining it
 * Sends 200 status and received spurr back to client
 * @param {Object} req
 * @param {Object} res
 */
router.getSpurr = function (req, res) {
  router.get('spurrs', 1, true)
  .then((data) => {
    res.status(200).send(data);
  });
};

/**
 * Calls get request to saved_spurrs database
 * Specifies to get 8 spurrs
 * Specifies to not delete anything
 * Sends 200 status and received spurrs back to client
 * @param {Object} req
 * @param {Object} res
 */
router.getSavedSpurrs = function (req, res) {
  router.get('saved_spurrs', 8, false)
  .then((data) => {
    res.status(200).send(data);
  });
};



module.exports = router;
