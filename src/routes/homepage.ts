import express, {NextFunction, Response, Request} from 'express';

const router = express.Router();

// pages

router.get('/', (req:Request, res:Response, next:NextFunction)=>{
    res.render('home')
})
router.get('/register', (req:Request, res:Response, next:NextFunction)=>{
    res.render('register')
})
router.get('/login', (req:Request, res:Response, next:NextFunction)=>{
    res.render('login', {error: ''})
})


export default router