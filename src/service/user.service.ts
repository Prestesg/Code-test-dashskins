import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../model/user.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }
    async getAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async insertUser(user: User): Promise<User> {
        const reqBody = {
            name: user.name,
            age: user.age,
            avatar: user?.avatar,
            email: user.email,
            steamId: user?.steamId,
        }
        const newUser = new this.userModel(reqBody);
        return newUser.save();
    }

    async updateUser(user: User) {
        const updatedUser = this.userModel.updateOne({_id:{$eq: user._id}},user);
        return updatedUser;
    }

    async delete(user: User): Promise<User> {
        return await this.userModel.findByIdAndRemove(user._id).exec();
    }
}