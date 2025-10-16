const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware"); // ensure user is logged in

const taskRouter = express.Router();

taskRouter.get("/get", protect, getTasks);

taskRouter.post("/add", protect, createTask);

taskRouter.put("/update/:id", protect, updateTask);

taskRouter.delete("delete/:id", protect, deleteTask);

module.exports = taskRouter;
