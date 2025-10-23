import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DtoAdd, DtoDelete, DtoEdit } from "./dto";

@Injectable()
export class TodoService {
    constructor(private prisma: PrismaService) { };
    async Get(userId: string) {
        try {
            const Todos = await this.prisma.todo.findMany({
                where: { userId },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        }
                    }
                }
            }
            );
            if (!Todos.length) {
                throw new NotFoundException("Todos Not found.");
            }
            return { message: "ok", data: Todos };
        }
        catch (e: any) {
            if (e instanceof ConflictException || e instanceof NotFoundException) throw e;
            console.log("Get error : ", e);
            throw new InternalServerErrorException("somthing bad happended!")
        }
    }

    async Add(dto: DtoAdd) {
        try {
            const check = await this.prisma.todo.findFirst({
                where: {
                    title: dto.title,
                    description: dto.description,
                    userId: dto.userId
                },
                include: {
                    user: false
                }
            });
            if (check) {
                throw new ConflictException("Invalid data");
            }
            const newTodo = await this.prisma.todo.create({
                data: dto ,
                include : {user : false}
            });
            return { message: "OK", data: newTodo };
        }
        catch (e: any) {
            if (e instanceof ConflictException || e instanceof NotFoundException) throw e;
            console.log("Add ErorrL ", e);
            throw new InternalServerErrorException("Internal Server Error!")
        }
    }

    async Edit(dto: DtoEdit) {
        try {
            const check = await this.prisma.todo.findFirst({
                where: { id: dto.todoId },
                include: { user: false }
            });
            if (!check) {
                throw new NotFoundException("Todo not found.!");
            }
            const updatedTodo = await this.prisma.todo.update({
                where: { id: dto.todoId },
                data: {
                    title: dto.title,
                    description: dto.description,
                    status: dto.status
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        }
                    }
                }
            });
            return { message: "Ok", data: updatedTodo };
        }
        catch (e: any) {
            if (e instanceof ConflictException || e instanceof NotFoundException) throw e;
            console.log("Edit Error: ", e);
            throw new InternalServerErrorException("Internal Server Error!");
        }
    }

    async Delete(dto : DtoDelete){
        try{
            await this.prisma.todo.delete({
                where : {id : dto.todoId},
                include : {user : false}
            });
            return {message : "ok"};
        }
        catch(e : any){
            if(e.code === "P2025") throw new NotFoundException("Todo Not Found.,");
            console.log("Delete Error : " , e);
            throw new InternalServerErrorException("Internal Server Error!");
        }
    }
}