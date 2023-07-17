import { Body, Controller, Delete, Get, HttpStatus, HttpException, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { User } from "../model/user.schema";
import { UserService } from "../service/user.service";
import { JwtService } from '@nestjs/jwt'

@Controller('/users')
export class UserController {
    constructor(
        private readonly userServerice: UserService,
        private jwtService: JwtService
    ) { }
    
    @Get()
    async findAll(@Res() response) {
        const users = await this.userServerice.getAll();
        return response.status(HttpStatus.OK).json({
            users
        })
    }
    @Post()
    async insertUser(@Res() response, @Body() user: User) {
        const newUSer = await this.userServerice.insertUser(user);
        return response.status(HttpStatus.CREATED).json({
            newUSer
        })
    }
    @Delete()
    async deleteUser(@Res() response, @Body() user: User) {
        const deletedUser = await this.userServerice.delete(user);
        return response.status(HttpStatus.OK).json({
            deletedUser
        })
    }
    @Put()
    async updateUser(@Res() response, @Body() user: User) {
        const updatedUser = await this.userServerice.updateUser(user);
        if(updatedUser.acknowledged){
            return response.status(HttpStatus.OK)           
        }else {
            return new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST)
        }
    }
    @Post('/signup')
    async Signup(@Res() response, @Body() user: User) {
        const newUSer = await this.userServerice.signup(user);
        return response.status(HttpStatus.CREATED).json({
            newUSer
        })
    }
    @Post('/signin')
    async SignIn(@Res() response, @Body() user: User) {
        const token = await this.userServerice.signin(user, this.jwtService);
        return response.status(HttpStatus.OK).json(token)
    }
}