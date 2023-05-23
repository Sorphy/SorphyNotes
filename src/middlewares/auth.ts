import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UserModel} from "../model/userModel";
const jwtsecret = process.env.JWT_SECRET as string;
export async function auth(req:Request | any, res:Response, next:NextFunction){
    try{
        // grab token from authorization header
        const authorization = req.headers.authorization;
        // grab token from authorization cookies
        // const authorization = req.cookies.jwt;

        // if it does not see the token
        if(!authorization){
            return res.status(401).json({Error:"Kindly sign in as a user"})          
        }
        // if it sees the token
        const token = authorization.slice(7, authorization.length);
        
        // verify if the token belongs to user
        let verified = jwt.verify(token, jwtsecret); //when using authization header
        // let verified = jwt.verify(authorization, jwtsecret); //when using cookies


        if(!verified){
            return res.status(401).json({Error:"invalid token, you cannot access this route"})          
        }
        const {id} = verified as {[key:string]: string}
        // find user by id(this part has to be changed in mongoose). if user, allow access to route, else ask that user check their mail.
        const user = await UserModel.findOne({where: {id}})
        if(!user){
            return res.status(401).json({Error:"Kindly register/signin as a user"})          
        }
        req.user = verified
        next(); //e.g, allow user to create todo

    }catch(err){
        res.status(401).json({Error:"User not logged in"})
    }
}
