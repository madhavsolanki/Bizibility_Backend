import { connection } from "../config/db.js";

// Create a new career listing
export const createCareer = async ({
  user_id,
  title,
  skills,
  experience,
  description,
  location,
  employment_type,
  salary_range,
}) => {
  const [result] = await connection.execute(
    `INSERT INTO carrers 
     (user_id, title, skills, experience, description, location, employment_type, salary_range)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      title,
      skills,
      experience,
      description,
      location,
      employment_type,
      salary_range,
    ]
  );
  return result.insertId; // Return new career ID
};

// Get all active careers
export const getAllActiveCareers = async () => {
  const [rows] = await connection.execute(
    `SELECT * FROM carrers WHERE is_active = TRUE ORDER BY created_at DESC`
  );
  return rows;
};

// Get a single career by ID
export const getCareerById = async (careerId) => {
  const [rows] = await connection.execute(
    `SELECT * FROM carrers WHERE id = ? LIMIT 1`,
    [careerId]
  );
  return rows[0];  // Return the career if found
};

// Update a career by ID
// Update a career by ID
export const updateCareerById = async (careerId, updatedData) => {
  const existingCareer = await getCareerById(careerId);
  if (!existingCareer) throw new Error("Career not found");

  // Merge fields: existing data and updated data
  const merged = { ...existingCareer, ...updatedData };

  const {
    title,
    skills,
    experience,
    description,
    location,
    employment_type,
    salary_range,
    is_active,
  } = merged;

  const [result] = await connection.execute(
    `UPDATE carrers SET 
      title = ?, skills = ?, experience = ?, description = ?, location = ?, 
      employment_type = ?, salary_range = ?, is_active = ?
     WHERE id = ?`,
    [
      title,
      skills,
      experience,
      description,
      location,
      employment_type,
      salary_range,
      is_active,
      careerId,
    ]
  );

  return result;
};


// Soft delete a career (mark inactive)
export const deleteCareerById = async (careerId) => {
  const [result] = await connection.execute(
    `UPDATE carrers SET is_active = FALSE WHERE id = ?`,
    [careerId]
  );
  return result;
};



