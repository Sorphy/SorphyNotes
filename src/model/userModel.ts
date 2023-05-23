
import mongoose, {Schema, Document} from 'mongoose'
import { NoteModel } from "./noteModel";

export interface UserAttributes extends Document {
    id: string;
    fullName: string;
    email: string;
    password: string,
    gender: string;
    phone: string;
    address: string
}


const UserSchema = new mongoose.Schema({
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'non-biary'],
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      }
}, { timestamps: true }
);

export const UserModel = mongoose.model<UserAttributes>('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id});
