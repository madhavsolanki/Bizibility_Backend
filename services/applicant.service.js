import { connection } from "../config/db.js";


export const createApplicantService = async ({
  user_id,
  job_id,
  first_name,
  last_name,
  email,
  contact_number,
  resume,
  cover_letter,
  linkedin_profile,
  portfolio_website,
  experience,
  info_source,
}) => {
  const [result] = await connection.execute(
    `INSERT INTO applicants 
      (user_id, job_id, first_name, last_name, email, contact_number, resume, cover_letter, 
       linkedin_profile, portfolio_website, experience, info_source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      job_id,
      first_name,
      last_name,
      email,
      contact_number,
      resume,
      cover_letter,
      linkedin_profile,
      portfolio_website,
      experience,
      info_source,
    ]
  );

  return result.insertId;
};

export const getAllApplicantsService = async () => {
  const [rows] = await connection.execute(
    `SELECT * FROM applicants ORDER BY created_at DESC`
  );
  return rows;
};

export const getApplicantsByJobIdService = async (jobId) => {
  const [rows] = await connection.execute(
    `SELECT * FROM applicants WHERE job_id = ? ORDER BY created_at DESC`,
    [jobId]
  );
  return rows;
};


export const getApplicantByIdService = async (applicantId) => {
  const [rows] = await connection.execute(
    `SELECT * FROM applicants WHERE id = ? LIMIT 1`,
    [applicantId]
  );
  return rows[0]; // return single applicant
};


