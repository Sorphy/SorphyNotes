"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDashboard = exports.Login = exports.Register = void 0;
const userModel_1 = require("../model/userModel");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const noteModel_1 = require("../model/noteModel");
const storage_1 = require("../model/storage");
const jwtsecret = process.env.JWT_SECRET;
const Register = async (req, res) => {
    try {
        const { fullName, email, password, confirm_password, gender, phone, address, } = req.body;
        // validate with joi or zod
        const validationResult = utils_1.registerUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            res.render('register', { Error: validationResult.error.details[0].message });
        }
        else {
            //  Hash password
            const passwordHash = await bcryptjs_1.default.hash(password, 8);
            // check if user exists
            const users = await userModel_1.UserModel.findOne({
                where: { email: email },
            });
            // let username = users?.dataValues.email
            let username = users?.email;
            if (username === 'undefined' || username === undefined) {
                if (email === "" && password !== confirm_password) {
                    res.render('register', { error: "Please provide all input fields" });
                }
                else {
                    if (gender === '') {
                        res.render('register', { error: "Please sign up" });
                    }
                    else {
                        let newUser = await userModel_1.UserModel.create({
                            fullName,
                            email,
                            password: passwordHash,
                            gender,
                            phone,
                            address,
                        });
                        await newUser.save();
                        res.redirect('/login');
                    }
                }
            }
            else {
                res.render('register', { error: "There isnt any valid user" });
            }
        }
    }
    catch (err) {
        console.log('internal service error');
        res.render('register', { error: err });
    }
};
exports.Register = Register;
const Login = async (req, res) => {
    try {
        const { email, password, } = req.body;
        // validate with joi or zod
        const validationResult = utils_1.loginUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({ Error: validationResult.error.details[0].message });
        }
        // check if user exists
        const User = await userModel_1.UserModel.findOne({ email: email }).exec();
        const fullName = User?.fullName;
        const id = User?._id;
        const hashedPass = User?.password;
        const token = (0, storage_1.signToken)(fullName, id);
        res.cookie('invisibleCookie', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        const cookie = req.cookies['invisibleCookie'];
        console.log('here');
        console.log(cookie);
        if (cookie) {
            bcryptjs_1.default.compare(password, hashedPass).then((result) => {
                if (result) {
                    res.redirect('/dashboard');
                }
                else {
                    res.render('register', { error: "Please sign up" });
                }
            });
        }
        else {
            res.render('login', { error: "Please login your saved credentials" });
        }
    }
    catch (err) {
        res.render('login', { error: 'Internal Server Error' });
    }
};
exports.Login = Login;
const getUserDashboard = async (req, res) => {
    try {
        let token = req.cookies['invisibleCookie'];
        if (token) {
            (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET, async (err, userData) => {
                if (err) {
                    res.render('login', { error: err });
                }
                else {
                    const fullName = userData.name;
                    const id = userData.id;
                    const limit = 6;
                    const page = parseInt(req.query.page) || 1;
                    const skip = (page - 1) * limit;
                    const note = await noteModel_1.NoteModel.find({ userId: id }).skip(skip).limit(limit);
                    const totalDocument = await noteModel_1.NoteModel.countDocuments();
                    const pageCount = Math.ceil(totalDocument / limit);
                    if (note) {
                        res.render('userDashboard', { message: `Welcome ${fullName}`, name: fullName, note: note, pageCount, currentPage: page });
                    }
                    else {
                        res.render('userDashboard', { message: `Welcome ${fullName}`, name: fullName });
                    }
                }
            });
        }
        else {
            res.render('login', { error: 'Please input your login details' });
        }
    }
    catch (error) {
        if (error) {
            res.redirect('/login');
        }
    }
};
exports.getUserDashboard = getUserDashboard;
