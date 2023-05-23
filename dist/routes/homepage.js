"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// pages
router.get('/', (req, res, next) => {
    res.render('home');
});
router.get('/register', (req, res, next) => {
    res.render('register');
});
router.get('/login', (req, res, next) => {
    res.render('login', { error: '' });
});
exports.default = router;
