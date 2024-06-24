const Task = require("../models/Task.js");

class TaskController {
  async getTasks(req, res) {
    try {
      const tasks = await Task.find({ owner: req.user._id });
      res.status(200).json(tasks);
    } catch (err) {
      res.status(404).json({ message: "Tasks no found", error: err });
    }
  }

  async getTasksById(req, res) {
    try {
      const taskId = req.params.id;
      const task = await Task.findOne({ _id: taskId, owner: req.user.id });

      if (!task) {
        return res
          .status(404)
          .json({ message: "Task not found or you are not the owner" });
      }

      await task.populate("owner");
      res.status(200).json(task);
    } catch (err) {
      res.status(404).json(err);
    }
  }

  async createTask(req, res) {
    const { title, description, completed } = req.body;

    const newTask = new Task({
      title,
      description,
      completed,
      owner: req.user.id,
    });

    try {
      await newTask.save();
    } catch (err) {
      return res.status(400).json({ message: "Cannot save task" });
    }

    res.status(200).json(newTask);
  }

  async updateTask(req, res) {
    const { title, description, completed } = req.body;
    const taskId = req.params.id;

    let existingTask;
    try {
      existingTask = await Task.findOne({ _id: taskId, owner: req.user._id });

      if (!existingTask) {
        return res
          .status(404)
          .json({ message: "Task not found or you are not the owner" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a task" });
    }

    existingTask.title = title;
    existingTask.description = description;
    existingTask.completed = completed;

    try {
      await existingTask.save();
    } catch (err) {
      return res.status(400).json({ message: "Cannot save task" });
    }

    res.status(200).json(existingTask);
  }

  async deleteTask(req, res) {
    const taskId = req.params.id;

    try {
      const deletedTask = await Task.findOneAndDelete({
        _id: taskId,
        owner: req.user._id,
      });

      if (!deletedTask) {
        return res
          .status(404)
          .json({ message: "Task not found or you are not the owner" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Cannot delete task" });
    }
  }

  async deleteAllTasks(req, res) {
    try {
      await Task.deleteMany({});
      res.status(200).json({ message: "All tasks deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Cannot delete tasks" });
    }
  }

  async getTasksByOwner(req, res) {
    const userId = req.user.id;

    if (!userId) {
      res.json({ message: "Not authorized" });
    }

    try {
      const task = await Task.findById(userId);
      console.log(task);
      await task.populate("owner");
      res.json(task);
    } catch (err) {}
  }
}

module.exports = new TaskController();
