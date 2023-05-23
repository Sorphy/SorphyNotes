"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const signToken = (name, id) => {
    const secret = process.env.JWT_SECRET;
    const token = (0, jsonwebtoken_1.sign)({ name: name, id: id }, 'itisnotyourbusiness');
    return token;
};
exports.signToken = signToken;
const verifyToken = (req, res, next) => {
    const cookie = req.cookies['invisibleCookie'];
    if (!cookie) {
        req.authenticated = false;
        res.render('Login', { error: "Please login your credentials" });
    }
    else {
        next();
    }
};
exports.verifyToken = verifyToken;
