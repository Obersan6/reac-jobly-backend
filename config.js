// "use strict";

// /** Shared config for application; can be required many places. */

// require("dotenv").config();
// require("colors");

// const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

// const PORT = +process.env.PORT || 3001;

// // Use dev database, testing database, or via env var, production database
// function getDatabaseUri() {
//   return (process.env.NODE_ENV === "test")
//       ? "postgresql://postgres:Caccolino5@localhost:5432/jobly_test"
//       : process.env.DATABASE_URL || "postgresql://postgres:Caccolino5@localhost:5432/jobly";
// }

// // Speed up bcrypt during tests, since the algorithm safety isn't being tested
// //
// // WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
// const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// console.log("Jobly Config:".green);
// console.log("SECRET_KEY:".yellow, SECRET_KEY);
// console.log("PORT:".yellow, PORT.toString());
// console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
// console.log("Database:".yellow, getDatabaseUri());
// console.log("---");

// module.exports = {
//   SECRET_KEY,
//   PORT,
//   BCRYPT_WORK_FACTOR,
//   getDatabaseUri,
// };


"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const { Client } = require("pg");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;

/** Adjust SSL Settings for Supabase */
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "postgresql://postgres:Caccolino5@localhost:5432/jobly_test"
    : process.env.DATABASE_URL;
}

// Ensure proper SSL settings for Supabase
const dbConfig = {
  connectionString: getDatabaseUri(),
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
};

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  dbConfig,
};
