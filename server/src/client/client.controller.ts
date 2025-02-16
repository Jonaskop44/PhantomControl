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
  BadRequestException,
  Patch,
  Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CreateFileDto, SendCommandDto } from './dto/client.dto';
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
    @Query('destination') destination: string,
    @Request() request,
  ) {
    if (!destination) throw new BadRequestException('Destination is required');

    return this.clientService.uploadFileToClient(
      hwid,
      request.user.sub.id,
      files,
      destination,
    );
  }

  @Get(':hwid/download')
  async downloadFileFromClient(
    @Param('hwid') hwid: string,
    @Query('filepath') filePath: string,
    @Query('filename') filename: string,
    @Request() request,
  ) {
    if (!filePath || !filename)
      throw new BadRequestException('File path and filename are required');

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

      const fileToDelete =
        filename === '*' ? this.clientService.massDownloadZipName : filename;
      fs.unlinkSync(path.join(this.clientService.downloadPath, fileToDelete));

      return streamableFile;
    } catch (error) {
      console.log(error);
      if (error instanceof ConflictException) {
        throw new NotFoundException(`File ${filename} not found.`);
      } else {
        throw new InternalServerErrorException('Failed to download file');
      }
    }
  }

  @Post(':hwid/file/create')
  async createFile(
    @Param('hwid') hwid: string,
    @Request() request,
    @Query('filepath') filePath: string,
    @Body() dto: CreateFileDto,
  ) {
    if (!filePath) throw new BadRequestException('File path is required');

    return this.clientService.createFile(
      hwid,
      request.user.sub.id,
      filePath,
      dto,
    );
  }

  @Get(':hwid/file/read')
  async readFile(
    @Param('hwid') hwid: string,
    @Query('filepath') filePath: string,
    @Request() request,
  ) {
    if (!filePath) throw new BadRequestException('File path is required');

    return this.clientService.readFile(hwid, request.user.sub.id, filePath);
  }

  @Patch(':hwid/file/update')
  async updateFile(
    @Param('hwid') hwid: string,
    @Request() request,
    @Query('filepath') filePath: string,
    @Body() dto: CreateFileDto,
  ) {
    if (!filePath) throw new BadRequestException('File path is required');

    return this.clientService.updateFile(
      hwid,
      request.user.sub.id,
      filePath,
      dto,
    );
  }

  @Delete(':hwid/file/delete')
  async deleteFile(
    @Param('hwid') hwid: string,
    @Request() request,
    @Query('filepath') filePath: string,
  ) {
    if (!filePath) throw new BadRequestException('File path is required');

    return this.clientService.deleteFile(hwid, request.user.sub.id, filePath);
  }

  @Get('registrations-last-30-days')
  async getClientRegistrationsLast30Days(@Request() request) {
    return this.clientService.getClientRegistrationsLast30Days(
      request.user.sub.id,
    );
  }
}
