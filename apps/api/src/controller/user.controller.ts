import { Body, Controller, Delete, Get, HttpStatus, HttpException, Post, UseInterceptors, Put, Req, Res,UploadedFile, Param } from "@nestjs/common";
import { User } from "../model/user.schema";
import { UserService } from "../service/user.service";
import { JwtService } from '@nestjs/jwt'
import { diskStorage } from "multer";
import { randomUUID } from 'crypto';
import Path = require('path');
import { FileInterceptor} from '@nestjs/platform-express';
import { join } from "path";

const storage = {
    storage : diskStorage({
        destination: 'src/uploads/files',
        filename: (req, file, cb) =>{
            const filename: string = 'myfile-' + randomUUID();
            const extension: string = Path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
        }
    })
}
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
    @UseInterceptors(FileInterceptor('avatar', storage))
    async insertUser(@Res() response, @Body() user: User,@UploadedFile() file) {
        console.log(user)
        if(file){
            user.avatar = file.filename;
        }
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
    @UseInterceptors(FileInterceptor('avatar', storage))
    async updateUser(@Res() response, @Body() user: User,@UploadedFile() file) {
        if(file){
            user.avatar = file.filename;
        }
        const updatedUser = await this.userService.updateUser(user);
        if(updatedUser.acknowledged){
            return response.status(HttpStatus.OK).json();           
        }else {
            return new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST)
        }
    }
    @Get('logout')
    async logout(@Res() res) {
        return res.clearCookie("api-token").json();
    }
    @Get('avatar-image/:image')
    async findAvatarImage(@Param("image") image, @Res() res) {
        return res.sendFile(join(process.cwd(),'src/uploads/files/' + image))
    }
    @Post('/signup')
    async Signup(@Res() response, @Body() user: User) {
        const newUSer = await this.userService.signup(user,this.jwtService);
        if(newUSer?.token){
            return response.cookie('api-token', newUSer?.token, { httpOnly: true }).status(HttpStatus.CREATED).json();
        }else {
            return new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED)
        }
    }
    @Post('/signin')
    async SignIn(@Req() request, @Res() response, @Body() user: User) {
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
                return response.cookie('api-token', signinRes.token, { httpOnly: true }).status(HttpStatus.OK).json();
            } else {
                return response.status(HttpStatus.UNAUTHORIZED).json();
            }
        }
    }
}