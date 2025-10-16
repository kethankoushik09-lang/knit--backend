const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const Task = require("../models/Task");

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashpassword });
    const user = await newUser.save();

    const token = await generateToken(user._id);

    res.cookie("usertoken", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ success: true, message: "User created", user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function loginUser(req, res) {
  try {
    console.log("user-loggout");
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.cookie("usertoken", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const tasks = await Task.find({ user: user._id }).select("-__v");


    res.status(200).json({ success: true, message: "User logged-in", tasks,user});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function AdminloginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check if email matches admin credentials
    if (email !== process.env.ADMIN_MAIL) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password with the one in env
    const isValidPassword = password === process.env.ADMIN_PASSWORD;

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token with 'admin' role
    const token = await generateToken(email);

    res.cookie("admintoken", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userStats = await Task.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user", // Task.user → User._id
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $group: {
          _id: "$userDetails._id",
          name: { $first: "$userDetails.name" },
          email: { $first: "$userDetails.email" },
          tasks: {
            $push: {
              title: "$title",
              description: "$description",
              completed: "$completed",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          email: 1,
          tasks: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Admin logged-in successfully",
      admin: { email: process.env.ADMIN_MAIL, role: "admin" },
      userStats,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// authController.js
async function logoutUser(req, res) {
  try {
    // Clear the user cookie
    res.clearCookie("usertoken", { httpOnly: true, sameSite: "Lax" });
    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function logoutAdmin(req, res) {
  try {
    // Clear the admin cookie
    res.clearCookie("admintoken", { httpOnly: true, sameSite: "Lax" });
    res.status(200).json({ success: true, message: "Admin logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { registerUser, loginUser, AdminloginUser, logoutUser, logoutAdmin };
