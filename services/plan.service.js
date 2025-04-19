import { connection } from "../config/db.js";

// Create a new plan
export const createPlan = async (title, price, duration, features) => {
  const safeTitle = title || '';
  const safePrice = typeof price === 'number' ? price : 0;
  const safeDuration = duration || '';
  const safeFeatures = Array.isArray(features) ? features : [];

  const [result] = await connection.execute(
    `INSERT INTO plans (title, price, duration, features)
     VALUES (?, ?, ?, ?)`,
    [
      safeTitle,
      safePrice,
      safeDuration,
      JSON.stringify(safeFeatures)
    ]
  );
  return result.insertId;
};

// Get all plans
export const getAllPlans = async () => {
  const [rows] = await connection.execute(`SELECT * FROM plans ORDER BY created_at DESC`);

  // Safely parse features
  return rows.map(plan => {
    let features = [];

    try {
      if (typeof plan.features === "string") {
        features = JSON.parse(plan.features);
      } else if (Array.isArray(plan.features)) {
        features = plan.features;
      }
    } catch (err) {
      console.error("Error parsing features for plan ID:", plan.id, plan.features);
      features = [];
    }

    return {
      ...plan,
      features,
    };
  });
};


// Get a single plan by ID
export const getPlanById = async (id) => {
  const [rows] = await connection.execute("SELECT * FROM plans WHERE id = ?", [id]);

  if (!rows.length) return null;

  const plan = rows[0];

  try {
    if (typeof plan.features === "string") {
      plan.features = JSON.parse(plan.features);
    }
  } catch (err) {
    console.error("Failed to parse features in getPlanById:", plan.features);
    plan.features = [];
  }

  return plan;
};


// Update plan by ID with fallback to existing data
export const updatePlan = async (id, updateData) => {
  const existingPlan = await getRawPlanById(id);

  if (!existingPlan) {
    throw new Error("Plan not found");
  }

  // Parse existing features safely
  let features = existingPlan.features;
  try {
    if (typeof features === "string") {
      features = JSON.parse(features);
    }
  } catch (err) {
    console.error("Failed to parse existing plan features:", features);
    features = [];
  }

  const {
    title = existingPlan.title,
    price = existingPlan.price,
    duration = existingPlan.duration,
    features: updatedFeatures = features,
  } = updateData;

  await connection.execute(
    `UPDATE plans
     SET title = ?, price = ?, duration = ?, features = ?
     WHERE id = ?`,
    [
      title,
      price,
      duration,
      JSON.stringify(Array.isArray(updatedFeatures) ? updatedFeatures : [updatedFeatures]),
      id,
    ]
  );

  return true;
};



// Delete plan by ID
export const deletePlan = async (id) => {
  await connection.execute("DELETE FROM plans WHERE id =?", [id]);
  return true;
};


// Get raw plan data for internal usage
export const getRawPlanById = async (id) => {
  const [rows] = await connection.execute("SELECT * FROM plans WHERE id = ?", [id]);
  return rows[0] || null;
};


// services/plan.service.js

export const getPlansByDuration = async (duration) => {
  const [rows] = await connection.execute(
    `SELECT * FROM plans WHERE duration = ? ORDER BY created_at DESC`,
    [duration]
  );

  return rows.map(plan => {
    let features = [];

    try {
      if (typeof plan.features === "string") {
        features = JSON.parse(plan.features);
      } else if (Array.isArray(plan.features)) {
        features = plan.features;
      }
    } catch (err) {
      console.error("Error parsing features for plan ID:", plan.id, plan.features);
      features = [];
    }

    return {
      ...plan,
      features,
    };
  });
};
