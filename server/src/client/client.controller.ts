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

  @Post(':hwid/command')
  async sendCommand(
    @Param('hwid') hwid: string,
    @Request() request,
    @Body() dto: SendCommandDto,
  ) {
    const result = await this.clientService.sendCommandToClient(
      hwid,
      request.user.sub.id,
      dto.command,
    );
    return result;
  }

  @Post(':hwid/destroy')
  async destroyConnection(@Param('hwid') hwid: string, @Request() request) {
    return this.clientService.destroyConnection(hwid, request.user.sub.id);
  }
}
