import { connection } from "../config/db.js";
import crypto from "crypto";

export const getUserByEmail = async (email) => {
  const [rows] = await connection.execute(
    `SELECT * FROM Users WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0];
};

export const getUserByPhone = async (phone) => {
  const [rows] = await connection.execute(
    `SELECT * FROM Users WHERE phone = ? LIMIT 1`,
    [phone]
  );
  return rows[0];
};

export const createUser = async ({
  fullName,
  email,
  password,
  phone,
  city,
  pincode,
  state,
  country,
}) => {
  const [result] = await connection.execute(
    `INSERT INTO Users 
      (full_name, email, password, phone, city, pincode, state, country)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [fullName, email, password, phone, city, pincode, state, country]
  );

  return result.insertId; // Returns new user's ID
};

export const getUserById = async (userId) => {
  const [rows] = await connection.execute(
    `SELECT * FROM Users WHERE id = ? LIMIT 1`,
    [userId]
  );
  return rows[0];
};

export const updateUserById = async (userId, updatedData) => {
  const existingUser = await getUserById(userId);
  if (!existingUser) throw new Error("User not found");

  // Merge fields
  const mergedData = { ...existingUser, ...updatedData };

  const {
    first_name,
    last_name,
    full_name,
    email,
    password,
    phone,
    address_line_1,
    address_line_2,
    city,
    pincode,
    state,
    country,
    about,
    facebook,
    twitter,
    linkedin,
    instagram,
    pinterest,
    user_type,
    profile_image
  } = mergedData;

  // Execute update
  const [result] = await connection.execute(
    `UPDATE Users SET
      first_name = ?, last_name = ?, full_name = ?, email = ?, password = ?, phone = ?,
      address_line_1 = ?, address_line_2 = ?, city = ?, pincode = ?, state = ?, country = ?,
      about = ?, facebook = ?, twitter = ?, linkedin = ?, instagram = ?, pinterest = ?,
      user_type = ?, profile_image = ?
     WHERE id = ?`,
    [
      first_name, last_name, full_name, email, password, phone,
      address_line_1, address_line_2, city, pincode, state, country,
      about, facebook, twitter, linkedin, instagram, pinterest,
      user_type, profile_image,
      userId
    ]
  );

  return result;
};

export const getAllUsers = async () => {
  const [rows] = await connection.execute(`SELECT * FROM Users`);
  return rows;
};

// Generate and save OTP
export const saveUserOtp = async (email, otp) => {
  await connection.execute(
    `UPDATE Users SET otp = ? WHERE email = ?`,
    [otp, email]
  );
};

// Verify OTP
export const verifyUserOtp = async (email, otp) => {
  const [rows] = await connection.execute(
    `SELECT * FROM Users WHERE email = ? AND otp = ? LIMIT 1`,
    [email, otp]
  );

  if (rows.length === 0) return false;

  await connection.execute(
    `UPDATE Users SET is_verified = TRUE, otp = NULL WHERE email = ?`,
    [email]
  );

  return true;
};

// Checking is User is Verified or NOT
export const isUserVerified = async (email) => {
  const [rows] = await connection.execute(
    `SELECT is_verified FROM Users WHERE email = ? LIMIT 1`,
    [email]
  );

  if (rows.length === 0) return null; // user not found
  return rows[0].is_verified === 1;
};


export const getOtpByEmail = async (email) => {
  const [rows] = await connection.execute(
    `SELECT otp FROM Users WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0];
};

export const updateUserPassword = async (email, hashedPassword) => {
  await connection.execute(
    `UPDATE Users SET password = ?, otp = NULL WHERE email = ?`,
    [hashedPassword, email]
  );
};
