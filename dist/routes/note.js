"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteController_1 = require("../controller/noteController");
const storage_1 = require("../model/storage");
const router = express_1.default.Router();
/* GET home page. */
router.get('/note', noteController_1.getUserAndNote);
router.post('/note', noteController_1.createNote);
router.get('/update/:title', storage_1.verifyToken, noteController_1.getUpdateNote);
router.post('/update/:title', storage_1.verifyToken, noteController_1.updateNote);
router.get('/delete/:title', storage_1.verifyToken, noteController_1.deleteNote);
exports.default = router;
