import express, {Application, Request, Response, NextFunction} from 'express';
const router = express.Router();
import { Register, Login, getUserDashboard } from '../controller/userController';
import { verifyToken } from '../model/storage';


/* GET users listing. */
router.post('/register', Register);
router.post('/login', Login);
router.get('/dashboard', verifyToken,getUserDashboard)

export default router;
