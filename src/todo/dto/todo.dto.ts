import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class DtoAdd {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    description: string;

    @IsNotEmpty()
    @IsString()
    userId: string;
}


enum Status {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export class DtoEdit{

    @IsNotEmpty()
    @IsString()
    todoId : string;
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    title: string ;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    description: string ;
    
    @IsNotEmpty()
    status : Status;
}


export class DtoDelete{
    @IsNotEmpty()
    @IsString()
    todoId : string;
}