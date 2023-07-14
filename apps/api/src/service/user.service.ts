import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../model/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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

    async signup(user: User): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        const reqBody = {
            name: user.name,
            age: user?.age,
            avatar: user?.avatar,
            steamId: user?.steamId,
            email: user?.email,
            password: hash
        }
        const newUser = new this.userModel(reqBody);
        return newUser.save();
    }   
    async signin(user: User, jwt: JwtService): Promise<any> {
        const foundUser = await this.userModel.findOne({ name: user.name }).exec();
        if (foundUser) {
            const { password } = foundUser;
            if (bcrypt.compare(user.password, password)) {
                const payload = { name: user.name };
                return {
                    token: jwt.sign(payload),
                };
            }
            return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
        }
        return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    }
    async delete(user: User): Promise<User> {
        return await this.userModel.findByIdAndRemove(user._id).exec();
    }
}