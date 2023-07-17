import { Body, Controller, Delete, Get, HttpStatus, HttpException, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { User } from "../model/user.schema";
import { UserService } from "../service/user.service";
import { JwtService } from '@nestjs/jwt'

@Controller('/users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) { }
    
    @Get()
    async findAll(@Res() response) {
        const users = await this.userService.getAll();
        return response.status(HttpStatus.OK).json({
            users
        })
    }
    @Post()
    async insertUser(@Res() response, @Body() user: User) {
        const newUSer = await this.userService.insertUser(user);
        return response.status(HttpStatus.CREATED).json({
            newUSer
        })
    }
    @Delete()
    async deleteUser(@Res() response, @Body() user: User) {
        const deletedUser = await this.userService.delete(user);
        return response.status(HttpStatus.OK).json({
            deletedUser
        })
    }
    @Put()
    async updateUser(@Res() response, @Body() user: User) {
        const updatedUser = await this.userService.updateUser(user);
        if(updatedUser.acknowledged){
            return response.status(HttpStatus.OK)           
        }else {
            return new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST)
        }
    }
    @Post('/signup')
    async Signup(@Res() response, @Body() user: User) {
        const newUSer = await this.userService.signup(user);
        return response.status(HttpStatus.CREATED).json({
            newUSer
        });
    }
    @Post('/signin')
    async SignIn(@Req() request, @Res() response, @Body() user: User) {
        console.log(request?.cookies?.['api-token'])
        if(request?.cookies?.['api-token']) {
            const token = request.cookies['api-token'];
            const decoded = this.jwtService.verify(token);
            const user = await this.userService.getOne(decoded._id)
            if(user) {
                return response.status(HttpStatus.OK).json();    
            } else {
                return new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED)
            }
        } else {
            const signinRes = await this.userService.signin(user, this.jwtService);
            if(signinRes.token){
                console.log(signinRes.token)
                return response.cookie('api-token', signinRes.token, { httpOnly: true }).status(HttpStatus.OK).json();
            } else {
                return response.status(HttpStatus.UNAUTHORIZED).json();
            }
        }
    }
}