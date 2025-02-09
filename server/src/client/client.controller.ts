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
  UploadedFiles,
  Query,
  StreamableFile,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { SendCommandDto } from './dto/client.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

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
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFileToClient(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('hwid') hwid: string,
    @Request() request,
  ) {
    return this.clientService.uploadFileToClient(
      hwid,
      request.user.sub.id,
      files,
    );
  }

  @Get(':hwid/download')
  async downloadFileFromClient(
    @Param('hwid') hwid: string,
    @Query('filepath') filePath: string,
    @Query('filename') filename: string,
    @Request() request,
  ) {
    const fileBuffer = await this.clientService.downloadFileFromClient(
      hwid,
      request.user.sub.id,
      filePath,
      filename,
    );

    try {
      const uint8Array = new Uint8Array(fileBuffer);

      const streamableFile = new StreamableFile(uint8Array, {
        disposition: 'attachment',
      });

      fs.unlinkSync(path.join(this.clientService.downloadPath, filename));

      return streamableFile;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new NotFoundException(`File ${filename} not found.`);
      } else {
        throw new InternalServerErrorException('Failed to download file');
      }
    }
  }
}
