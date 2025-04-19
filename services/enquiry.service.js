import { connection } from "../config/db.js";

// 1.CREATE ENQUIRY
export const createEnquiry = async (data) => {
  const { user_id, plan_id, fullname, phone, email, category  } = data;

  const [result] = await connection.execute(
    `INSERT INTO enquiry (user_id, plan_id, fullname, phone, email, category)
    VALUES (?, ?, ?, ?, ?, ?)`,
   [user_id, plan_id, fullname, phone, email, category]
  );
  return result.insertId;
};

// 2. GET ALL ENQUIRIES
export const getAllEnquiries = async () => {
  const [rows] = await connection.execute(`
    SELECT e.*, u.username AS user_name, p.title AS plan_title
    FROM enquiry e
    LEFT JOIN users u ON e.user_id = u.id
    LEFT JOIN plans p ON e.plan_id = p.id
    ORDER BY e.created_at DESC
  `);

  return rows;
};


// 3. GET ENQUIRY BY ID
export const getEnquiryById = async (id) => {
  const [rows] = await connection.execute(`
    SELECT e.*, u.username AS user_name, p.title AS plan_title
    FROM enquiry e
    LEFT JOIN users u ON e.user_id = u.id
    LEFT JOIN plans p ON e.plan_id = p.id
    WHERE e.id = ?
  `, [id]);

  return rows[0];
};


// 4. UPDATE ENQUIRY STATUS
export const updateEnquiryStatus = async (id, status) => {
  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  const [result] = await connection.execute(
    `UPDATE enquiry SET approval_status = ? WHERE id = ?`,
    [status, id]
  );

  return result.affectedRows > 0;
};