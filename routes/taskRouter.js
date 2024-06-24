const Router = require("express");
const taskController = require("../controllers/taskController.js");
const auth = require("../middleware/auth");

const router = new Router();

router.get("/tasks", auth, taskController.getTasks);
router.get("/tasks/:id", auth, taskController.getTasksById);

router.post("/tasks", auth, taskController.createTask);

router.delete("/tasks/:id", auth, taskController.deleteTask);
router.patch("/tasks/:id", auth, taskController.updateTask);
router.delete("/tasks", auth, taskController.deleteAllTasks);

router.get("/user-tasks", auth, taskController.getTasksByOwner);

module.exports = router;
