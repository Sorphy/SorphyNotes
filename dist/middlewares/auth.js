"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
const jwtsecret = process.env.JWT_SECRET;
async function auth(req, res, next) {
    try {
        // grab token from authorization header
        const authorization = req.headers.authorization;
        // grab token from authorization cookies
        // const authorization = req.cookies.jwt;
        // if it does not see the token
        if (!authorization) {
            return res.status(401).json({ Error: "Kindly sign in as a user" });
        }
        // if it sees the token
        const token = authorization.slice(7, authorization.length);
        // verify if the token belongs to user
        let verified = jsonwebtoken_1.default.verify(token, jwtsecret); //when using authization header
        // let verified = jwt.verify(authorization, jwtsecret); //when using cookies
        if (!verified) {
            return res.status(401).json({ Error: "invalid token, you cannot access this route" });
        }
        const { id } = verified;
        // find user by id(this part has to be changed in mongoose). if user, allow access to route, else ask that user check their mail.
        const user = await userModel_1.UserModel.findOne({ where: { id } });
        if (!user) {
            return res.status(401).json({ Error: "Kindly register/signin as a user" });
        }
        req.user = verified;
        next(); //e.g, allow user to create todo
    }
    catch (err) {
        res.status(401).json({ Error: "User not logged in" });
    }
}
exports.auth = auth;
