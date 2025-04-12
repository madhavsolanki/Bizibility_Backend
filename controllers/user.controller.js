import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  getUserByPhone,
  createUser,
  getUserById,
  updateUserById,
  getAllUsers,
  saveUserOtp,
  verifyUserOtp,
  isUserVerified,
  getOtpByEmail,
  updateUserPassword
} from "../services/user.service.js";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { sendOtpEmail, sendPasswordResetEmail } from "../utils/sendEmail.js";



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
      return res.status(409).json({success:false, message: 'Email is already registered' });
    }

    if (existingPhone) {
      return res.status(409).json({success:false, message: 'Phone number is already registered' });
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
      return res.status(500).json({success:false, message: 'Error creating user' });
    }

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      userId
    });

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const generateOtpForVerification  = async (req, res) => {
  try {
    
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({success:false, message: 'Email is required' });
    }

    const user = await getUserByEmail(email);
    if(!user){
      return res.status(404).json({success:false, message:'Email not found . Please register first' });
    }

    const verified = await isUserVerified(email);
    if(verified){
      return res.status(409).json({success:false, message:'Account already verified please Login'});
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await saveUserOtp(email, otp);
    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please check your inbox.',
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const verifyOtpAndActivateUser  = async (req, res) => {
  try {
    
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({success:false, message: 'Email and OTP are required' });
    }

    const user = await getUserByEmail(email);
    if(!user){
      return res.status(404).json({success:false, message:'Email not found . Please register first' });
    }

    const verified = await isUserVerified(email);
    if(verified){
      return res.status(409).json({success:false, message:'Account already verified please Login'});
    }

    const isOtpValid = await verifyUserOtp(email, otp);
    if(!isOtpValid){
      return res.status(401).json({success:false, message: 'Invalid or Expired OTP'});
    }

    return res.status(200).json({
      success: true,
      message: 'Account verified successfully. You can now login.',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({success:false, message: 'Email and password are required' });
  }

  try {
     // 2. Check if user exists
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({success:false, message: 'Invalid credentials' });
    }

    // 3. Check if user is verified
    const verified = await isUserVerified(email);
    if (!verified) {
     return res.status(403).json({
       success: false,
       message: "Account is not verified. Please verify your account.",
     });
   }

     // 4. Compare password
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
       return res.status(401).json({success:false, message: 'Invalid credentials' });
     }

     

      // 5. Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        userType: user.user_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
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
      },
    });

  } catch (error) {
    
    res.status(500).json({success:false, message: 'Server error during login', error: error.message });
  }
};

export const forgotPassword =  async (req, res) => {
  try {
    const {email} = req.body;

    if(!email){
      return res.status(400).json({success:false, message:'Email is required'});
    }

    const user = await getUserByEmail(email);
    if(!user){
      return res.status(404).json({success:false, message:'Email not found . Please register first'});
    }

    const isVerified = await isUserVerified(email);
    if(!isVerified){
      return res.status(403).json({success:false, message:'Account is not verified. Please verify your account'});
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await saveUserOtp(email, otp);
    await sendPasswordResetEmail(email, otp);

    return res.status(200).json({
      success:true,
      message:'OTP sent to your email for password reset',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
    try {
      const { email, otp, password, confirmPassword } = req.body;

      // 1. Check for required fields
    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2. Check if email is valid
    const emailExists = await getUserByEmail(email);
    if (!emailExists) {
      return res.status(404).json({ message: "Email not found." });
    }

    // 2. Check if password matches confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

     // 3. Get stored OTP from DB
     const user = await getOtpByEmail(email);
     if (!user || !user.otp) {
       return res.status(400).json({ message: "Invalid or expired OTP." });
     }

     // 4. Compare OTPs
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear OTP
    await updateUserPassword(email, hashedPassword);

    // Respond success
    return res.status(200).json({ message: "Password reset successful." });


    } catch (error) {
      return res.status(500).json({success:true, message: "Something went wrong.", error:error.message });
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
