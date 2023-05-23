"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.getUpdateNote = exports.createNote = exports.getUserAndNote = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const noteModel_1 = require("../model/noteModel");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const secret = process.env.JWT_SECRET;
const getUserAndNote = async (req, res) => {
    try {
        const cookie = req.cookies['invisibleCookie'];
        console.log(cookie);
        if (cookie) {
            (0, jsonwebtoken_1.verify)(cookie, secret, (err, data) => {
                if (err) {
                    res.render('userDashboard', { error: err });
                }
                else {
                    res.render('home', { error: '' });
                }
            });
        }
        else {
            res.redirect('/login');
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.getUserAndNote = getUserAndNote;
const createNote = async (req, res) => {
    try {
        const cookie = req.cookies['invisibleCookie'];
        if (cookie) {
            (0, jsonwebtoken_1.verify)(cookie, secret, async (err, data) => {
                if (err) {
                    res.redirect('/login');
                }
                else {
                    const userId = data?.id;
                    const { title, description, dueDate, status } = req.body;
                    const note = new noteModel_1.NoteModel({
                        title,
                        description,
                        dueDate,
                        status,
                        userId
                    });
                    await note.save();
                    res.redirect('/dashboard');
                }
            });
        }
        else {
            res.render('login', { error: 'Pls log in as a user' });
        }
    }
    catch (error) {
        res.render('home', { error: error });
    }
};
exports.createNote = createNote;
const getUpdateNote = async (req, res) => {
    try {
        const cookie = req.cookies['invisibleCookie'];
        if (cookie) {
            (0, jsonwebtoken_1.verify)(cookie, secret, async (err, result) => {
                if (err) {
                    console.error(err);
                }
                else {
                    const id = result?.id;
                    const title = req.params.title;
                    const note = await noteModel_1.NoteModel.findOne({ userId: id, title: title }).exec();
                    console.log(note);
                    if (note) {
                        res.render('update', { note: note, error: '' });
                    }
                    else {
                        res.render('home', { error: '' });
                    }
                }
            });
        }
    }
    catch (error) {
    }
};
exports.getUpdateNote = getUpdateNote;
const updateNote = async (req, res) => {
    try {
        const cookie = req.cookies['invisibleCookie'];
        if (cookie) {
            (0, jsonwebtoken_1.verify)(cookie, secret, async (err, result) => {
                if (err) {
                    console.error(err);
                }
                else {
                    const noteTitle = req.params.title;
                    const { title, description, dueDate, status } = req.body;
                    const note = await noteModel_1.NoteModel.findOne({ title: noteTitle }).exec();
                    if (note) {
                        await noteModel_1.NoteModel.findOneAndUpdate({ title: noteTitle }, {
                            title: title,
                            description: description,
                            dueDate: dueDate,
                            status: status
                        });
                        res.redirect('/dashboard');
                    }
                    else {
                        res.redirect('/');
                    }
                }
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.updateNote = updateNote;
const deleteNote = async (req, res) => {
    try {
        const title = req.params.title;
        const note = await noteModel_1.NoteModel.findOneAndDelete({ title: title }).exec();
        if (!note) {
            res.render('userDashboard', { message: 'Note not found' });
        }
        res.redirect('/dashboard');
    }
    catch (error) {
        console.log(error);
    }
};
exports.deleteNote = deleteNote;
