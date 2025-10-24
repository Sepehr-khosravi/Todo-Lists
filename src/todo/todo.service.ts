import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DtoAdd, DtoDelete, DtoEdit } from "./dto";

@Injectable()
export class TodoService {
    constructor(private prisma: PrismaService) { };

    async Get(userId: string) {
        try {
            const todos = await this.prisma.todo.findMany({
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
            });

            if (!todos || todos.length === 0) {
                return { message: "No todos found", data: [] };
            }

            return { message: "ok", data: todos };
        }
        catch (e: any) {
            if (e instanceof ConflictException || e instanceof NotFoundException) throw e;
            console.log("Get error : ", e);
            throw new InternalServerErrorException("Something bad happened!");
        }
    }

    async Add(dto: DtoAdd) {
        try {
            const check = await this.prisma.todo.findFirst({
                where: {
                    title: dto.title,
                    userId: dto.userId
                }
            });

            if (check) {
                throw new ConflictException("Todo with this title already exists for this user");
            }

            const newTodo = await this.prisma.todo.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    userId: dto.userId,
                    status: 'PENDING' 
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

            return { message: "OK", data: newTodo };
        }
        catch (e: any) {
            if (e instanceof ConflictException) throw e;
            console.log("Add Error: ", e);
            throw new InternalServerErrorException("Internal Server Error!");
        }
    }

    async Edit(dto: DtoEdit) {
        try {
            const check = await this.prisma.todo.findFirst({
                where: { id: dto.todoId }
            });

            if (!check) {
                throw new NotFoundException("Todo not found!");
            }

            const updateData: any = {};
            if (dto.title !== undefined) updateData.title = dto.title;
            if (dto.description !== undefined) updateData.description = dto.description;
            if (dto.status !== undefined) updateData.status = dto.status;
            // updateData.status = dto.status ? dto.status : null;

            const updatedTodo = await this.prisma.todo.update({
                where: { id: dto.todoId },
                data: updateData,
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
            if (e instanceof NotFoundException) throw e;
            console.log("Edit Error: ", e);
            throw new InternalServerErrorException("Internal Server Error!");
        }
    }

    async Delete(dto: DtoDelete) {
        try {
            const todo = await this.prisma.todo.findFirst({
                where: { id: dto.todoId }
            });

            if (!todo) {
                throw new NotFoundException("Todo Not Found");
            }

            await this.prisma.todo.delete({
                where: { id: dto.todoId }
            });

            return { message: "ok" };
        }
        catch (e: any) {
            if (e instanceof NotFoundException) throw e;
            if (e.code === "P2025") {
                throw new NotFoundException("Todo Not Found");
            }
            console.log("Delete Error : ", e);
            throw new InternalServerErrorException("Internal Server Error!");
        }
    }
}