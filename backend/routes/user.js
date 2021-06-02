const express = require("express");
const router = express.Router();
const verifPassword = require('../middleware/verifPassword');

const userCtrl = require("../controllers/user");

router.post("/signup",verifPassword, userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/me",userCtrl.getUserProfile);
router.put("/me",userCtrl.updateUserProfile);
router.delete("/:id",userCtrl.deleteUser);


module.exports = router;