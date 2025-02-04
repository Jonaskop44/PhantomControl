import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { SendCommandDto } from './dto/client.dto';

@Controller('clients')
@UseGuards(JwtGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async getClients(@Request() request) {
    return this.clientService.getClientsByUserId(request.user.sub.id);
  }

  @Post(':clientId/command')
  async sendCommand(
    @Param('id') clientId: number,
    @Request() request,
    @Body() dto: SendCommandDto,
  ) {
    return this.clientService.sendCommandToClient(
      clientId,
      request.user.sub.id,
      dto.command,
    );
  }
}
