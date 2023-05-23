import { Request, Response } from "express";
import { UserModel } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import { registerUserSchema, options, loginUserSchema } from "../utils/utils";
import bcrypt from "bcryptjs";
import jwt, { verify } from "jsonwebtoken";
import { NoteModel } from "../model/noteModel";
import { existsSync } from "fs";
import { signToken } from "../model/storage";

const jwtsecret = process.env.JWT_SECRET as string;

export const Register = async(req:Request, res:Response) => {
  try {
    const {
      fullName,
      email,
      password,
      confirm_password,
      gender,
      phone,
      address,
    } = req.body;
    

    // validate with joi or zod

    const validationResult = registerUserSchema.validate(req.body, options);
    if (validationResult.error) {
      res.render('register', { Error: validationResult.error.details[0].message });
    }else{
    //  Hash password
      const passwordHash = await bcrypt.hash(password, 8);
      // check if user exists
      const users = await UserModel.findOne({
        where: { email: email },
      });
      // let username = users?.dataValues.email
      let username = users?.email;
      

      if (username === 'undefined' || username === undefined) {
        if(email === "" && password !== confirm_password){
          res.render('register', {error: "Please provide all input fields"})
        }else{
          
          if(gender === '') {
            res.render('register', {error: "Please sign up"})
          }else{
              let newUser = await UserModel.create({
                fullName,
                email,
                password: passwordHash,
                gender,
                phone,
                address,
              });
              await newUser.save()
              res.redirect('/login')

            }
        }
      }else{
        res.render('register', {error: "There isnt any valid user"})
      }
    } 
  }catch (err) {   
    console.log('internal service error')
    res.render('register', {error: err})
  }
};

export const Login = async (req: Request, res: Response) => {
    try{
        const {
            email,
            password,
        } = req.body;
      
        // validate with joi or zod
        const validationResult = loginUserSchema.validate(req.body, options);
        if (validationResult.error) {
            return res.status(400).json({ Error: validationResult.error.details[0].message });
        }        
        // check if user exists
        const User = await UserModel.findOne({ email: email }).exec()
  
          const fullName = User?.fullName;
          const id = User?._id
          const hashedPass: any = User?.password
        
          const token = signToken(fullName, id)
          res.cookie('invisibleCookie', token, {httpOnly:true, maxAge:30 *24 * 60 * 60 * 1000})
          const cookie = req.cookies['invisibleCookie']
          console.log('here')
          console.log(cookie)
          if(cookie){
            bcrypt.compare(password, hashedPass).then((result: any) => {
              if(result){
                res.redirect('/dashboard')
                  
              }else{
                res.render('register', {error: "Please sign up"})
              }

            })
            
          }else{
            res.render('login', {error: "Please login your saved credentials"})


          }       
    }catch(err){
        res.render('login', {error: 'Internal Server Error'})
        
    }
}

export const getUserDashboard = async(req:Request, res: Response) => {
  try {
    let token = req.cookies['invisibleCookie']
    if(token){
      verify(token, process.env.JWT_SECRET!, async(err: any, userData: any) => {
        if (err) {
          res.render('login', {error: err})
        } else {
          const fullName = userData.name
          const id = userData.id

          const limit = 6
          const page = parseInt(req.query.page as string) || 1
          const skip = (page -1) * limit
          const note = await NoteModel.find({ userId: id}).skip(skip).limit(limit)
          const totalDocument = await NoteModel.countDocuments()
          const pageCount = Math.ceil(totalDocument / limit)
          
          
          if(note) {
            res.render('userDashboard', {message: `Welcome ${fullName}`, name: fullName, note: note, pageCount, currentPage: page})
          }else{
            res.render('userDashboard', {message: `Welcome ${fullName}`, name: fullName})
          }
        }
      })
      
    }else{
      res.render('login', {error: 'Please input your login details'})
    }
    
  } catch (error) {
    if(error) {
      res.redirect('/login')
    }
  }
} 