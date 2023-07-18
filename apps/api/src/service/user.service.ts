import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
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
    };
    const newUser = new this.userModel(reqBody);
    return newUser.save();
  }

  async updateUser(user: User) {
    const updatedUser = this.userModel.updateOne({ _id: user._id }, user);
    return updatedUser;
  }

  async signup(user: User): Promise<any> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const reqBody = {
      name: user.name,
      password: hash,
    };
    const newUser = new this.userModel(reqBody);
    const userRes = await newUser.save();
    const payload = { name: user.name, _id: userRes._id };
    return { token: this.jwtService.sign(payload) };
  }
  async signin(user: User): Promise<any> {
    const foundUser = await this.userModel.findOne({ name: user.name }).exec();
    if (foundUser) {
      const { password } = foundUser;
      if (await bcrypt.compare(user.password, password)) {
        const payload = { name: user.name, _id: foundUser._id };
        return {
          token: this.jwtService.sign(payload),
        };
      }
      throw new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    throw new HttpException(
      'Incorrect username or password',
      HttpStatus.UNAUTHORIZED,
    );
  }
  async delete(user: User): Promise<User> {
    return await this.userModel.findByIdAndRemove(user._id).exec();
  }
  async getOne(_id): Promise<User> {
    return await this.userModel.findOne({ _id }).exec();
  }
  async verifyToken(token): Promise<User> {
    return this.jwtService.verify(token);
  }
}
