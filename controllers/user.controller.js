import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  getUserByPhone,
  createUser,
  getUserById,
  updateUserById,
  getAllUsers
} from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import fs from 'fs';


export const registerUser = async (req, res) => {
  try {

    const {
      fullName,
      email,
      password,
      phone,
      city,
      pincode,
      state,
      country
    } = req.body;


    if (!fullName || !email || !password || !phone || !city || !pincode || !state || !country) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingEmail = await getUserByEmail(email);
    const existingPhone = await getUserByPhone(phone);

    if (existingEmail) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    if (existingPhone) {
      return res.status(409).json({ message: 'Phone number is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser({
      fullName,
      email,
      password: hashedPassword,
      phone,
      city,
      pincode,
      state,
      country
    });

    if (!userId) {
      return res.status(500).json({ message: 'Error creating user' });
    }
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


export const loginUSer = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({success:false, message: 'Email and password are required' });
  }

  try {
     // 2. Get user from DB   
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({success:false, message: 'Invalid email or password' });
    }

     // 3. Compare password
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
       return res.status(401).json({success:false, message: 'Invalid email or password' });
     }

      // 4. Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userType: user.user_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

     // 5. Return response
     res.status(200).json({
      success:true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        userType: user.user_type,
      },
    });

  } catch (error) {
    
    res.status(500).json({success:false, message: 'Server error during login', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedFields = req.body;

     // Hash the password if it's provided
     if (updatedFields.password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(updatedFields.password, salt);
    }

    // Handle profile image (from multer)
    if (req.file) {
      updatedFields.profile_image = fs.readFileSync(req.file.path);
      fs.unlinkSync(req.file.path); // Remove file from server after reading
    }

    await updateUserById(userId, updatedFields);

     // Fetch the updated user
     const updatedUser = await getUserById(userId);

      // Remove binary image data from response
    if (updatedUser && updatedUser.profile_image) {
      delete updatedUser.profile_image;
    }

     res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("❌ Error updating user:", error.message);
    res.status(500).json({success:false, message: "Failed to update user", error: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove binary profile_image from the response
    if (user.profile_image) {
      delete user.profile_image;
    }

    res.status(200).json({
      success: true,
      message: "User info retrieved successfully",
      user
    });

  } catch (error) {
    console.error("❌ Error fetching user info:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user info",
      error: error.message
    });
  }
};


export const getAllUsersInfo = async (req, res) => {
  try {
    const users = await getAllUsers();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found"
      });
    }

    const filteredUsers = users.map(user => {
      const { profile_image, ...textualData } = user;
      return textualData;
    });

    res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      users: filteredUsers
    });

  } catch (error) {
    console.error("❌ Error fetching all users:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message
    });
  }
};
