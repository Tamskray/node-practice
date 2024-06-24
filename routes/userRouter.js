const Router = require("express");
const userController = require("../controllers/userController.js");
const auth = require("../middleware/auth");

const router = new Router();

router.get("/users", auth, userController.getUsers);
router.get("/users/:id", auth, userController.getUserById);
router.post("/users", userController.signup);
router.delete("/users/:id", auth, userController.deleteUser);
router.patch("/users/:id", auth, userController.updateUser);
router.delete("/users", auth, userController.deleteAllUsers);

router.post("/users/login", userController.login);
router.get("/profile", auth, async (req, res) => {
  res.send(req.user);
});
router.post("/users/logout", auth, userController.logout);
router.post("/users/logoutAll", auth, userController.logoutAll);

module.exports = router;
