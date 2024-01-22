import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { UsersService } from './users.service';
export declare class UserByIdPipe implements PipeTransform<string> {
    private readonly usersService;
    constructor(usersService: UsersService);
    transform(value: string, metadata: ArgumentMetadata): {
        id: string;
        host: boolean;
    };
}
