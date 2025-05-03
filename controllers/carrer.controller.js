import {
  createCareer,
  getAllActiveCareers,
  getCareerById,
  updateCareerById,
  deleteCareerById,
} from "../services/career.service.js";

export const createCareerController = async (req, res) => {
  try {
    const {
      title,
      skills,
      experience,
      description,
      location,
      employment_type,
      salary_range,
      user_id, // fallback if user is not authenticated
    } = req.body;

    const userId = req.user?.id || user_id;

    // Validate required fields
    if (!userId || !title || !skills || !experience || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const newCareerId = await createCareer({
      user_id: userId,
      title,
      skills,
      experience,
      description,
      location,
      employment_type,
      salary_range,
    });

    res.status(201).json({
      success: true,
      message: "Career created successfully",
      careerId: newCareerId,
    });
  } catch (error) {
    console.error("Create Career Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the career",
    });
  }
};


export const getAllActiveCareersController = async (req, res) => {
  try {
    const careers = await getAllActiveCareers();
    res.status(200).json({
      success: true,
      data: careers,
    });
  } catch (error) {
    console.error("Error fetching active careers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active careers",
    });
  }
};

export const updateCareerController = async (req, res) => {
  const { careerId } = req.params;
  const updatedData = req.body;

  try {
    // Call the service to update the career by ID
    const updatedCareer = await updateCareerById(careerId, updatedData);

    if (!updatedCareer) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Career updated successfully",
      data: updatedCareer,
    });
  } catch (error) {
    console.error("Error updating career:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update career",
    });
  }
};

export const deleteCareerController = async (req, res) => {
  const { careerId } = req.params;

  try {
    // Call the service to soft delete (mark as inactive) the career by ID
    const result = await deleteCareerById(careerId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Career not found or already inactive",
      });
    }

    res.status(200).json({
      success: true,
      message: "Career successfully deleted (soft delete)",
    });
  } catch (error) {
    console.error("Error deleting career:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete career",
    });
  }
};

export const getCareerByIdController = async (req, res) => {
  const { careerId } = req.params;  // Get careerId from the URL parameters

  try {
    // Fetch career by ID using the service function
    const career = await getCareerById(careerId);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    res.status(200).json({
      success: true,
      data: career,
    });
  } catch (error) {
    console.error("Error fetching career by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch career",
    });
  }
};