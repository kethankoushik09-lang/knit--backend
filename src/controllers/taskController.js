const Task = require("../models/Task.js");

async function getTasks(req, res) {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function createTask(req, res) {
  try {
    const { title, description } = req.body;
    const newtask = new Task({ title, description, user: req.user._id });
    const task = await newtask.save();

    res.status(201).json({success:true,task});
  } catch (err) {
    res.status(400).json({ message: "Error creating task", error: err.message });
  }
}

async function updateTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating task", error: err.message });
  }
}

async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting task", error: err.message });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
