import express from 'express';
import {getUserAndNote, updateNote, deleteNote, createNote, getUpdateNote } from '../controller/noteController';
import {auth} from "../middlewares/auth"
import { verifyToken } from '../model/storage';

const router = express.Router();

/* GET home page. */


router.get('/note', getUserAndNote);
router.post('/note', createNote)
router.get('/update/:title', verifyToken, getUpdateNote);
router.post('/update/:title', verifyToken,updateNote);
router.get('/delete/:title', verifyToken,deleteNote);


export default router;
