"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controller/userController");
const storage_1 = require("../model/storage");
/* GET users listing. */
router.post('/register', userController_1.Register);
router.post('/login', userController_1.Login);
router.get('/dashboard', storage_1.verifyToken, userController_1.getUserDashboard);
exports.default = router;
