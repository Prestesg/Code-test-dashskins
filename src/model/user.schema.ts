import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User {
    _id: mongoose.Schema.Types.ObjectId;
    @Prop({required:true})
    name: string;
    @Prop({required:true})
    age: number;
    @Prop({required:true, unique:true, lowercase:true})
    email: string;
    @Prop()
    avatar: string;
    @Prop()
    steamId: string
    @Prop()
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User)