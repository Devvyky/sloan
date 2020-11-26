const express = require("express");

const authController = require("../controllers/authController");
// const studentController = require('../controllers/student/studentController');

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
