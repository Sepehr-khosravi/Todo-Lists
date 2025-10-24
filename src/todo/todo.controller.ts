import { Controller , UseGuards , Post , Get , Body, Req, Delete } from '@nestjs/common';
import { JwtGuard } from 'src/auth/Guard';
import { TodoService } from './todo.service';
import {  DtoEdit,DtoDelete } from './dto';

@UseGuards(JwtGuard)
@Controller('todo')
export class TodoController {
    constructor(private todoService : TodoService){};
    @Get()
    Get(@Req() req : any){
        return this.todoService.Get(req.user.userId);
    }
    @Post("add")
    Add(@Body() dto : any,@Req() req : any){
        dto.userId = req.user.userId;
        return this.todoService.Add(dto);
    }

    @Post("edit")
    Edit(@Body() dto : DtoEdit ){
        return this.todoService.Edit(dto);
    }

    @Post("delete")
    Delete(@Body() dto : DtoDelete){
        return this.todoService.Delete(dto);
    }
}
