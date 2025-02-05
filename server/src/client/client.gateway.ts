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
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway()
export class ClientGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clients: Map<string, Socket> = new Map();
  constructor(
    @Inject(forwardRef(() => ClientService))
    private clientService: ClientService,
  ) {}

  afterInit(server: Server) {
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

  sendCommandToClient(data: Client, command: string) {
    const clientSocket = this.clients.get(data.hwid);
    if (clientSocket) {
      clientSocket.emit('command', command);
      return {
        message: 'Command sent to client ${clientId}',
        status: 'success',
      };
    } else {
      return { message: 'Client not found', status: 'error' };
    }
  }
}
