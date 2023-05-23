import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { v4 as uuidv4, v4 } from 'uuid';
import { NoteModel } from "../model/noteModel";
import { createNoteSchema, options, updateNoteSchema } from "../utils/utils";
import * as dotenv from 'dotenv'

dotenv.config()

const secret = process.env.JWT_SECRET as string

export const getUserAndNote = async(req:Request, res:Response)=>{
  try{
    const cookie = req.cookies['invisibleCookie']
    console.log(cookie);
    
    if(cookie) {
      verify(cookie, secret, (err: any, data: any) => {
        if(err) {
          res.render('userDashboard', {error: err})
        }else{
          res.render('home', {error: ''})
        }
      })
    }else{
      res.redirect('/login')
    }
   
  }catch(err){
      console.log(err);
  }
}
export const createNote = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies['invisibleCookie']
    if(cookie){
      verify(cookie, secret, async(err: any, data:any) => {
        if(err) {
          res.redirect('/login')
        }else{
          const userId = data?.id
          const { title, description, dueDate, status } = req.body;
          const note = new NoteModel({
            title,
            description,
            dueDate,
            status, 
            userId
          });
          await note.save();
          res.redirect('/dashboard')
        }
      })
      

    }else{
      res.render('login', {error: 'Pls log in as a user'})
    }
    
    
  } catch (error) {
    res.render('home', { error: error });
  }
};


export const getUpdateNote = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies['invisibleCookie']
    if(cookie){
      verify(cookie, secret, async(err: any, result: any) => {
        if(err){
          console.error(err)
        }else{
          const id = result?.id
          const title = req.params.title
          const note = await NoteModel.findOne({ userId: id, title: title}).exec()
          console.log(note)
          if(note){
            res.render('update', { note: note, error: ''})
          }else{
            res.render('home', {error: ''})
          }
        }
      })
    }
  } catch (error) {
    
  }

}

export const updateNote = async (req: Request, res: Response) => {
  try{
    const cookie = req.cookies['invisibleCookie']
    if(cookie){
      verify(cookie, secret, async(err: any, result: any) => {
        if(err){
          console.error(err)
        }else{
          const noteTitle = req.params.title;
          const { title, description, dueDate, status } = req.body;
          const note = await NoteModel.findOne({title: noteTitle}).exec();
          if (note) {
            await NoteModel.findOneAndUpdate({title:noteTitle}, {
              title: title,
              description: description,
              dueDate: dueDate,
              status: status
            })
            res.redirect('/dashboard');
            
          }else{
            res.redirect('/')
          
          }
          
        }
      })
    }
    
  } catch(error){
    console.log(error);
  }
}

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const title = req.params.title;
    const note = await NoteModel.findOneAndDelete({title: title}).exec();
    if (!note) {
      res.render('userDashboard', { message: 'Note not found' });
      
    }
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};
