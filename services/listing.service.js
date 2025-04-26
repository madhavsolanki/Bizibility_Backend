import { connection } from "../config/db.js";

// Create a new listing
export const createListing = async (data) => {
  const {
    plan_id,
    user_id,
    business_name,
    phone,
    category,
    address,
    city,
    state,
    pincode,
    website,
    description,
    logo,
    image,
    video,
    faq,
    sociallinks,
    business_hour,
    email_owner,
    video_link,
    tagline,
    custom_fields,
    payment_status,
    gallery_images,
    tags,
    profileImage,
    price_details
  } = data;

  const [result] = await connection.execute(
    `INSERT INTO listings 
      (plan_id, user_id, business_name, phone, category, address, city, state, pincode, website, description, logo, image, video, faq, sociallinks, business_hour, email_owner, video_link, tagline, custom_fields, payment_status, gallery_images, tags, profileImage, price_details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      plan_id,
      user_id,
      business_name,
      phone,
      category,
      address,
      city,
      state,
      pincode,
      website,
      description,
      logo,
      image,
      video,
      faq ? JSON.stringify(faq) : null,
      sociallinks ? JSON.stringify(sociallinks) : null,
      business_hour ? JSON.stringify(business_hour) : null,
      email_owner,
      video_link,
      tagline,
      custom_fields ? JSON.stringify(custom_fields) : null,
      payment_status,
      gallery_images ? JSON.stringify(gallery_images) : null,
      tags,
      profileImage,
      price_details ? JSON.stringify(price_details) : null,
    ]
  );

  return result.insertId;
};

// Get listing by ID
export const getListingById = async (id) => {
  const [rows] = await connection.execute(
    `SELECT * FROM listings WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

// Get all listings with optional filters
export const getAllListings = async (filters) => {
  const { category, city, state, tags, user_id } = filters;
  let query = "SELECT * FROM listings WHERE 1=1";
  let params = [];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (city) {
    query += " AND city = ?";
    params.push(city);
  }

  if (state) {
    query += " AND state = ?";
    params.push(state);
  }

  if (tags) {
    query += " AND tags LIKE ?";
    params.push(`%${tags}%`);
  }

  if (user_id) {
    query += " AND user_id = ?";
    params.push(user_id);
  }

  const [rows] = await connection.execute(query, params);
  return rows;
};

// Update listing by ID
export const updateListing = async (id, updatedData) => {
  const { business_name, address, description, logo, image, video, gallery_images, payment_status } = updatedData;

  const [result] = await connection.execute(
    `UPDATE listings 
     SET business_name = ?, address = ?, description = ?, logo = ?, image = ?, video = ?, gallery_images = ?, payment_status = ?
     WHERE id = ?`,
    [
      business_name,
      address,
      description,
      logo,
      image,
      video,
      gallery_images ? JSON.stringify(gallery_images) : null,
      payment_status,
      id,
    ]
  );

  return result;
};

// Delete listing by ID
export const deleteListing = async (id) => {
  const [result] = await connection.execute(
    `DELETE FROM listings WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
};

// Get listings by user ID
export const getListingsByUserId = async (user_id) => {
  const [rows] = await connection.execute(
    `SELECT * FROM listings WHERE user_id = ?`,
    [user_id]
  );
  return rows;
};

// Get listings by plan ID
export const getListingsByPlanId = async (plan_id) => {
  const [rows] = await connection.execute(
    `SELECT * FROM listings WHERE plan_id = ?`,
    [plan_id]
  );
  return rows;
};

// Search listings by various fields
export const searchListings = async (searchTerm) => {
  const [rows] = await connection.execute(
    `SELECT * FROM listings WHERE business_name LIKE ? OR category LIKE ? OR tags LIKE ?`,
    [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
  );
  return rows;
};

// Get listings with specific payment status
export const getListingsByPaymentStatus = async (payment_status) => {
  const [rows] = await connection.execute(
    `SELECT * FROM listings WHERE payment_status = ?`,
    [payment_status]
  );
  return rows;
};
