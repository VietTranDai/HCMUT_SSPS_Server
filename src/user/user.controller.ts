import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@GetUser() user) {
    var userId = user.sub;
    return await this.userService.getCurrentUser(userId);
  }
}
