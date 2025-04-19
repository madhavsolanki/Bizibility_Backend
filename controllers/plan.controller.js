import { createPlan, updatePlan, deletePlan, getAllPlans, getPlanById, getPlansByDuration } from "../services/plan.service.js";


// Create a new plan (superadmin only)
export const createPlanController = async (req, res) => {
  try {
    const { title, price, duration, features } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing title." });
    }

    if (price === undefined || isNaN(price)) {
      return res.status(400).json({ success: false, message: "Price must be a valid number." });
    }

    if (!duration || typeof duration !== "string") {
      return res.status(400).json({ success: false, message: "Invalid or missing duration." });
    }

    if (!Array.isArray(features)) {
      return res.status(400).json({ success: false, message: "Features must be an array." });
    }

    const planId = await createPlan(title, price, duration, features);

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: { id: planId },
    });

  } catch (error) {
    console.error("Create Plan Error:", error);
    res.status(500).json({ success: false, message: "Server error while creating plan." });
  }
};


// Update a plan (superadmin only, with fallback to existing data)
export const updatePlanController = async (req, res) => {
  try {
    const {id} = req.params;
    const updateData = req.body;

    await updatePlan(id,updateData);

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
    });

  } catch (error) {
    console.error("Update Plan Error:", error);
    const message = error.message === "Plan not found" ? error.message : "Server error while updating plan.";
    res.status(error.message === "Plan not found" ? 404 : 500).json({ success: false, message });
  }  
}

// Delete a plan (superadmin only)
export const deletePlanController = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getPlanById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }


    await deletePlan(id);

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete Plan Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting plan.",
    });
  }  
}

// Get all plans
export const getAllPlansController = async (req, res) => {
 try {
  const plans = await getAllPlans();

  res.status(200).json({ success: true, data: plans });


 } catch (error) {
  console.error("Fetch All Plans Error:", error);
  res.status(500).json({ success: false, message: "Server error while fetching plans." });
 } 
}


// Get a plan by ID
export const getPlanByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await getPlanById(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error("Fetch Single Plan Error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching plan." });
  }
}


// Get plans by duration
export const getPlansByDurationController = async (req, res) => {
  try {
    const { duration} = req.params;

    if(!duration || (duration !== "monthly" && duration !== "yearly")) {
      return res.status(400).json({ success: false, message: "Duration must be either 'monthly' or 'yearly'." });
    }

    const plans = await getPlansByDuration(duration);

    res.status(200).json({
      success: true,
      message: `Plans fetched successfully for duration: ${duration}`,
      data: plans,
    });
   
  } catch (error) {
    console.error("Fetch Plans by Duration Error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching plans." });
  }  
}