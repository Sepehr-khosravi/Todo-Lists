import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { SignInValidator, SignUpValidator } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { };
    async signin(User: SignInValidator) {
        try {
            const checkUser = await this.prisma.user.findFirst({
                where: { email: User.email }
            });
            if (!checkUser) {
                throw new BadRequestException("Somthing bad happended!", {
                    cause: new Error(),
                    description: "Invalid Data"
                });
            }
            const checkPassword = await bcrypt.compare(User.password, checkUser.password);
            if (!checkPassword) {
                throw new BadRequestException("Somthing bad happended!", {
                    cause: new Error(),
                    description: "Invalid Data"
                })
            };
            const token = await this.jwt.signAsync(
                { userId: checkUser.id, email: checkUser.email },
                { secret: this.config.get("JWT_KEY"), expiresIn: "1d" }
            )
            if (!token) {
                throw new InternalServerErrorException("somthing bad happened!(token)", {
                    cause: new Error(),
                    description: "Internal Server Error!"
                });
            }
            const { password, ...data } = checkUser;
            return {
                message: "Welcome!",
                token: token,
                data: data
            }
        }
        catch (e: any) {
            if (e instanceof ConflictException || e instanceof BadRequestException){
                return;
            } ;
            console.log("signin error : ", e);
            throw new InternalServerErrorException("somthing bad happened!");
        }
    }

    async signup(User: SignUpValidator) {
        try {
            const checkUserInDb = await this.prisma.user.findFirst({
                where: { email: User.email }
            });
            if (checkUserInDb) {
                throw new ConflictException("Somthing bad happened", {
                    cause: new Error(),
                    description: "Invalid Data"
                })
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(User.password, salt);
            const newUser = await this.prisma.user.create({
                data: {
                    username : User.username,
                    email : User.email ,
                    password : hashPassword,
                }
            });
            const token = await this.jwt.signAsync(
                { userId: newUser.id, email: newUser.email },
                { secret: this.config.get("JWT_KEY"), expiresIn: "1d" }
            )
            if (!token) {
                throw new InternalServerErrorException("somthing bad happened!", {
                    cause: new Error(),
                    description: "Internal Server Error!"
                });
            }
            const { password, ...data } = newUser;
            return { message: "Welcome", token: token, data: data };
        }
        catch (e: any) {
            if (e instanceof ConflictException){
                return;
            };
            console.log("signup error :", e);
            throw new InternalServerErrorException("somthing bad happened!");
        }
    }
}