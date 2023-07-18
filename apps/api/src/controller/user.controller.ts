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
        private readonly userService: UserService
    ) { }
    
    @Get()
    async findAll(@Res() response) {
        try {
            const users = await this.userService.getAll();
            return response.status(HttpStatus.OK).json({
                users
            })      
        } catch (error) {
            throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Post()
    @UseInterceptors(FileInterceptor('avatar', storage))
    async insertUser(@Res() response, @Body() user: User,@UploadedFile() file) {
        try {
            if(file){
                user.avatar = file.filename;
            }
            const newUSer = await this.userService.insertUser(user);
            return response.status(HttpStatus.CREATED).json({
                newUSer
            })
        } catch (error) {
            throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Delete()
    async deleteUser(@Res() response, @Body() user: User) {
        try {
            const deletedUser = await this.userService.delete(user);
            return response.status(HttpStatus.OK).json({
                deletedUser
            })
        } catch (error) {
            throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Put()
    @UseInterceptors(FileInterceptor('avatar', storage))
    async updateUser(@Res() response, @Body() user: User,@UploadedFile() file) {
        try {
            if(file){
                user.avatar = file.filename;
            }
            const updatedUser = await this.userService.updateUser(user);
            if(updatedUser.acknowledged){
                return response.status(HttpStatus.OK).json();           
            }else {
                throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST)
            }
        } catch (error) {
            throw new HttpException('Erro interno do servidor', HttpStatus.BAD_REQUEST)
        }
    }
    @Get('logout')
    async logout(@Res() res) {
        try {
            return res.clearCookie("api-token").json();
        } catch (error) {
            throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Get('avatar-image/:image')
    async findAvatarImage(@Param("image") image, @Res() res) {
        try {
            return res.sendFile(join(process.cwd(),'src/uploads/files/' + image))
        } catch (error) {
            throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Post('/signup')
    async signUp(@Res() response, @Body() user: User) {
        try {
            const newUSer = await this.userService.signup(user);
            if(newUSer?.token){
                return response.cookie('api-token', newUSer?.token, { httpOnly: true }).status(HttpStatus.CREATED).json();
            }else {
                throw new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED)
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    @Post('/signin')
    async signIn(@Req() request, @Res() response, @Body() user: User) {
        try {
            if(request?.cookies?.['api-token']) {
                const token = request.cookies['api-token'];
                const decoded = await this.userService.verifyToken(token);
                const user = await this.userService.getOne(decoded._id)
                if(user) {
                    return response.status(HttpStatus.OK).json();    
                } else {
                    throw new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED)
                }
            } else {
                const signinRes = await this.userService.signin(user);
                if(signinRes.token){
                    return response.cookie('api-token', signinRes.token, { httpOnly: true }).status(HttpStatus.OK).json();
                } else {
                    throw new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED)
                }
            }
            
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNAUTHORIZED)
        }
    }   
}