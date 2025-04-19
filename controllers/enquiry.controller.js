import {
  createEnquiry,
  getEnquiryById,
  getAllEnquiries,
  updateEnquiryStatus,
} from "../services/enquiry.service.js";
import { getPlanById } from "../services/plan.service.js";

// Create a new enquiry
export const createEnquiryController = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user.id;
    const { fullname, phone, email, category } = req.body;

    if (!fullname || typeof fullname !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing fullname." });
    }

    if (!phone || typeof phone !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing phone number." });
    }

    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing email." });
    }

    if (!category || typeof category !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing category." });
    }

    const existingPlan = await getPlanById(planId);

    if (!existingPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found." });
    }

    const enquiryId = await createEnquiry({
      user_id: userId,
      plan_id: planId,
      fullname,
      phone,
      email,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      data: { id: enquiryId },
    });
  } catch (error) {
    console.error("Create Enquiry Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating enquiry.",
    });
  }
};

// 2. GET ALL ENQUIRIES
export const getAllEnquiriesController = async (req, res) => {
  try {
    const enquiries = await getAllEnquiries();

    res.status(200).json({
      success: true,
      message: "Enquiries retrieved successfully",
      data: enquiries,
    });
  } catch (error) {
    console.error("Get All Enquiries Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching  enquiries.",
    });
  }
};

// 3. GET ENQUIRY BY ID
export const getEnquiryByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await getEnquiryById(id);

    if (!enquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found." });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry retrieved successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Get Enquiry By Id Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching enquiry.",
    });
  }
};

// Update an enquiry status (superadmin only)
export const updateEnquiryStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await updateEnquiryStatus(id, status);

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found." });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Enquiry Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating enquiry status.",
    });
  }
};
