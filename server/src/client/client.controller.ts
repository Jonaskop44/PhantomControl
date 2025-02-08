import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Param,
  Body,
  Response,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { SendCommandDto } from './dto/client.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Response() response,
    @Body() dto: SendCommandDto,
  ) {
    const result = await this.clientService.sendCommandToClient(
      hwid,
      request.user.sub.id,
      dto,
      (commandResponse) => {
        const data = commandResponse
          .split('\n')
          .filter((line) => line.trim() !== '');
        response.json({ output: data });
      },
    );
    return result;
  }

  @Post(':hwid/destroy')
  async destroyConnection(@Param('hwid') hwid: string, @Request() request) {
    return this.clientService.destroyConnection(hwid, request.user.sub.id);
  }

  @Post(':hwid/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToClient(
    @UploadedFile() file: Express.Multer.File,
    @Param('hwid') hwid: string,
    @Request() request,
  ) {
    return this.clientService.uploadFileToClient(
      hwid,
      request.user.sub.id,
      file,
    );
  }

  @Get(':hwid/download/:filename')
  async downloadFileFromClient(
    @Param('hwid') hwid: string,
    @Param('filename') filename: string,
    @Request() request,
  ) {
    const file = await this.clientService.downloadFileFromClient(
      hwid,
      request.user.sub.id,
      filename,
    );
    return file;
  }
}
