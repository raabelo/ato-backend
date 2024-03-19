import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { QueueService } from './queue.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class GamesGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private queueService: QueueService) {}

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(client: Socket, payload: string) {
    this.queueService.joinQueue(client, payload);
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(client: Socket, payload: string) {
    this.queueService.joinGame(client, payload);
  }

  @SubscribeMessage('gameAction')
  handleGameAction(client: Socket, payload: string) {
    this.queueService.gameAction(client, payload);
  }
}
