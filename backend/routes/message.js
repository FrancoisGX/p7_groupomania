const express = require("express");
const router = express.Router();


const multer = require('../middleware/multer-config');
const messageCtrl = require("../controllers/messages");

router.post("/new", multer,messageCtrl.createMessage);
router.get("/", messageCtrl.listMessages);
router.put('/:id',messageCtrl.updateUserMessage);
router.delete('/:id',messageCtrl.deleteMessage);


module.exports = router;
