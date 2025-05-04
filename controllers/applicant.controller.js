import {
  createApplicantService,
  getAllApplicantsService,
  getApplicantByIdService,
  getApplicantsByJobIdService,
} from "../services/applicant.service.js";

export const createApplicant = async (req, res) => {
  try {
    const user_id = req.user?.id || user_id;
    const job_id = req.params.id;

    const {
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
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !contact_number ||
      !info_source
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    if (!resume) {
      return res
        .status(400)
        .json({ success: false, message: "Resume file is required" });
    }

    const applicantData = {
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
    };

    const insertedId = await createApplicantService(applicantData);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      applicantId: insertedId,
    });
  } catch (error) {
    console.error("Error creating applicant:", error);
    res
      .status(500)
      .json({
        success: false,
        error: error.message || "Internal server error",
      });
  }
};

export const getAllApplicants = async (req, res) => {
  try {
    const applicants = await getAllApplicantsService();

    return res.status(200).json({
      success: true,
      message: "Applicants fetched successfully",
      data: applicants,
    });
  } catch (error) {
    console.error("Error getting applicant:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: error.message || "Internal server error",
      });
  }
};

export const getApplicantsByJobId = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const applicants = await getApplicantsByJobIdService(jobId);

    res.status(200).json({
      success: true,
      message: "Applicants for the job fetched successfully",
      data: applicants,
    });
  } catch (error) {
    console.error("Error fetching applicants by job ID:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getApplicantById = async (req, res) => {
  try {
    const applicantId = req.params.id;

    if (!applicantId) {
      return res.status(400).json({
        success: false,
        message: "Applicant ID is required",
      });
    }

    const applicant = await getApplicantByIdService(applicantId);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Applicant details fetched successfully",
      data: applicant,
    });
  } catch (error) {
    console.error("Error fetching applicant:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
