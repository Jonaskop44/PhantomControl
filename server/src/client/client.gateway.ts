import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ClientGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clients: Map<number, Socket> = new Map();

  afterInit(server: Server) {
    console.log('WebSocket Server initialized', server);
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
  handleRegister(client: Socket, clientId: number) {
    this.clients.set(clientId, client);
    console.log(`Client ${clientId} registered with socket ID: ${client.id}`);
  }

  sendCommandToClient(clientId: number, command: string) {
    const clientSocket = this.clients.get(clientId);
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
