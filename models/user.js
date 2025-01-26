// "use strict";

// const db = require("../db");
// const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
// const {
//   NotFoundError,
//   BadRequestError,
//   UnauthorizedError,
// } = require("../expressError");

// const { BCRYPT_WORK_FACTOR } = require("../config.js");

// /** Related functions for users. */

// class User {
//   /** authenticate user with username, password.
//    *
//    * Returns { username, first_name, last_name, email, is_admin }
//    *
//    * Throws UnauthorizedError is user not found or wrong password.
//    **/

//   static async authenticate(username, password) {
//     // try to find the user first
//     const result = await db.query(
//           `SELECT username,
//                   password,
//                   first_name AS "firstName",
//                   last_name AS "lastName",
//                   email,
//                   is_admin AS "isAdmin"
//            FROM users
//            WHERE username = $1`,
//         [username],
//     );

//     const user = result.rows[0];

//     if (user) {
//       // compare hashed password to a new hash from password
//       const isValid = await bcrypt.compare(password, user.password);
//       if (isValid === true) {
//         delete user.password;
//         return user;
//       }
//     }

//     throw new UnauthorizedError("Invalid username/password");
//   }

//   /** Register user with data.
//    *
//    * Returns { username, firstName, lastName, email, isAdmin }
//    *
//    * Throws BadRequestError on duplicates.
//    **/

//   static async register(
//       { username, password, firstName, lastName, email, isAdmin }) {
//     const duplicateCheck = await db.query(
//           `SELECT username
//            FROM users
//            WHERE username = $1`,
//         [username],
//     );

//     if (duplicateCheck.rows[0]) {
//       throw new BadRequestError(`Duplicate username: ${username}`);
//     }

//     const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

//     const result = await db.query(
//           `INSERT INTO users
//            (username,
//             password,
//             first_name,
//             last_name,
//             email,
//             is_admin)
//            VALUES ($1, $2, $3, $4, $5, $6)
//            RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
//         [
//           username,
//           hashedPassword,
//           firstName,
//           lastName,
//           email,
//           isAdmin,
//         ],
//     );

//     const user = result.rows[0];

//     return user;
//   }

//   /** Find all users.
//    *
//    * Returns [{ username, first_name, last_name, email, is_admin }, ...]
//    **/

//   static async findAll() {
//     const result = await db.query(
//           `SELECT username,
//                   first_name AS "firstName",
//                   last_name AS "lastName",
//                   email,
//                   is_admin AS "isAdmin"
//            FROM users
//            ORDER BY username`,
//     );

//     return result.rows;
//   }

//   /** Given a username, return data about user.
//  *
//  * Returns { username, firstName, lastName, email, isAdmin, appliedJobs }
//  *   where appliedJobs is an array of job IDs the user has applied to.
//  *
//  * Throws NotFoundError if user not found.
//  **/
// static async get(username) {
//   const userRes = await db.query(
//     `SELECT username,
//             first_name AS "firstName",
//             last_name AS "lastName",
//             email,
//             is_admin AS "isAdmin"
//      FROM users
//      WHERE username = $1`, [username]);

//   const user = userRes.rows[0];

//   if (!user) throw new NotFoundError(`No user: ${username}`);

//   // Retrieve applied job IDs for the user
//   const userApplicationsRes = await db.query(
//     `SELECT job_id
//      FROM applications
//      WHERE username = $1`, [username]
//   );

//   // Store the applied job IDs inside an array
//   user.appliedJobs = userApplicationsRes.rows.map(a => a.job_id);

//   return user;
// }


//   /** Update user data with `data`.
//    *
//    * This is a "partial update" --- it's fine if data doesn't contain
//    * all the fields; this only changes provided ones.
//    *
//    * Data can include:
//    *   { firstName, lastName, password, email, isAdmin }
//    *
//    * Returns { username, firstName, lastName, email, isAdmin }
//    *
//    * Throws NotFoundError if not found.
//    *
//    * WARNING: this function can set a new password or make a user an admin.
//    * Callers of this function must be certain they have validated inputs to this
//    * or a serious security risks are opened.
//    */

//   static async update(username, data) {
//     if (data.password) {
//       data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
//     }

//     const { setCols, values } = sqlForPartialUpdate(
//         data,
//         {
//           firstName: "first_name",
//           lastName: "last_name",
//           isAdmin: "is_admin",
//         });
//     const usernameVarIdx = "$" + (values.length + 1);

//     const querySql = `UPDATE users 
//                       SET ${setCols} 
//                       WHERE username = ${usernameVarIdx} 
//                       RETURNING username,
//                                 first_name AS "firstName",
//                                 last_name AS "lastName",
//                                 email,
//                                 is_admin AS "isAdmin"`;
//     const result = await db.query(querySql, [...values, username]);
//     const user = result.rows[0];

//     if (!user) throw new NotFoundError(`No user: ${username}`);

//     delete user.password;
//     return user;
//   }

//   /** Delete given user from database; returns undefined. */

//   static async remove(username) {
//     let result = await db.query(
//           `DELETE
//            FROM users
//            WHERE username = $1
//            RETURNING username`,
//         [username],
//     );
//     const user = result.rows[0];

//     if (!user) throw new NotFoundError(`No user: ${username}`);
//   }

//   /** Apply for job: update db, returns undefined.
//    *
//    * - username: username applying for job
//    * - jobId: job id
//    **/

//   static async applyToJob(username, jobId) {
//     const preCheck = await db.query(
//           `SELECT id
//            FROM jobs
//            WHERE id = $1`, [jobId]);
//     const job = preCheck.rows[0];

//     if (!job) throw new NotFoundError(`No job: ${jobId}`);

//     const preCheck2 = await db.query(
//           `SELECT username
//            FROM users
//            WHERE username = $1`, [username]);
//     const user = preCheck2.rows[0];

//     if (!user) throw new NotFoundError(`No username: ${username}`);

//     await db.query(
//           `INSERT INTO applications (job_id, username)
//            VALUES ($1, $2)`,
//         [jobId, username]);
//   }
// }


// module.exports = User;






"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** Authenticate user with username, password.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws UnauthorizedError if user not found or wrong password.
   **/
  static async authenticate(username, password) {
    console.log(`🔵 Authenticating user: ${username}`);

    // Try to find the user in the database
    const result = await db.query(
      `SELECT username,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              is_admin AS "isAdmin"
       FROM users
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      console.warn(`⚠️ User '${username}' not found`);
      throw new UnauthorizedError("Invalid username/password");
    }

    // Compare hashed password to a new hash from password
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid === true) {
      console.log(`✅ Login successful for user: ${username}`);
      delete user.password;
      return user;
    }

    console.warn(`⚠️ Invalid password for user: ${username}`);
    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register a new user.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/
  static async register({ username, password, firstName, lastName, email, isAdmin }) {
    console.log(`🔵 Registering new user: ${username}`);

    const duplicateCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      console.warn(`⚠️ Duplicate username attempted: ${username}`);
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
       (username, password, first_name, last_name, email, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [username, hashedPassword, firstName, lastName, email, isAdmin]
    );

    console.log(`✅ User registered successfully: ${username}`);
    return result.rows[0];
  }

  /** Find all users. */
  static async findAll() {
    console.log("🔵 Fetching all users");
    const result = await db.query(
      `SELECT username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"
       FROM users
       ORDER BY username`
    );
    return result.rows;
  }

  /** Get user details by username. */
  static async get(username) {
    console.log(`🔵 Fetching user: ${username}`);

    const userRes = await db.query(
      `SELECT username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"
       FROM users WHERE username = $1`, [username]);

    const user = userRes.rows[0];

    if (!user) {
      console.warn(`⚠️ No user found with username: ${username}`);
      throw new NotFoundError(`No user: ${username}`);
    }

    console.log(`✅ User found: ${username}`);
    return user;
  }

  /** Update user data. */
  static async update(username, data) {
    console.log(`🔵 Updating user: ${username}`);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`;

    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) {
      console.warn(`⚠️ Update failed: No user found with username ${username}`);
      throw new NotFoundError(`No user: ${username}`);
    }

    console.log(`✅ User updated: ${username}`);
    delete user.password;
    return user;
  }

  /** Delete a user. */
  static async remove(username) {
    console.log(`🔵 Deleting user: ${username}`);

    let result = await db.query(
      `DELETE FROM users WHERE username = $1 RETURNING username`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      console.warn(`⚠️ Delete failed: No user found with username ${username}`);
      throw new NotFoundError(`No user: ${username}`);
    }

    console.log(`✅ User deleted: ${username}`);
  }

  /** Apply for a job. */
  static async applyToJob(username, jobId) {
    console.log(`🔵 User '${username}' applying for job '${jobId}'`);

    const preCheck = await db.query(`SELECT id FROM jobs WHERE id = $1`, [jobId]);
    if (!preCheck.rows[0]) throw new NotFoundError(`No job: ${jobId}`);

    const userCheck = await db.query(`SELECT username FROM users WHERE username = $1`, [username]);
    if (!userCheck.rows[0]) throw new NotFoundError(`No user: ${username}`);

    await db.query(
      `INSERT INTO applications (job_id, username)
       VALUES ($1, $2)`, [jobId, username]);

    console.log(`✅ User '${username}' successfully applied to job '${jobId}'`);
  }
}

module.exports = User;
