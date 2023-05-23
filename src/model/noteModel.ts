
import { UserModel } from "./userModel";
import mongoose, {Schema, Document} from "mongoose";

export interface NoteAttributes extends Document {
  id: string;
  title: string,
  description: string;
  dueDate: string;
  status: string;
  userId: string;
}

const NoteSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true }
);
export const NoteModel = mongoose.model<NoteAttributes>('Note', NoteSchema);





