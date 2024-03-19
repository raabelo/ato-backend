import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { GamesService } from './games.service';
import { UsersService } from 'src/users/users.service';
import { CardsService } from 'src/cards/cards.service';
import { DecksService } from 'src/decks/decks.service';
import { User } from '@prisma/client';

// Defina um tipo para a entrada da fila que inclua o socket e o playerId
type GameEntry = {
  socket: Socket;
  playerId: string;
};

@Injectable()
export class QueueService {
  private readonly queues = new Map<string, GameEntry[]>();
  private readonly games = new Map<string, GameEntry[]>();
  constructor(
    private gamesService: GamesService,
    private usersService: UsersService,
    private cardsService: CardsService,
    private decksService: DecksService,
  ) {}

  async joinQueue(socket: Socket, payload: string) {
    const session = JSON.parse(payload);
    if (!this.queues.has(session.sessionId)) {
      this.queues.set(session.sessionId, []);
    }

    const queue = this.queues.get(session.sessionId);
    queue.push({ socket, playerId: session.playerId });
    this.queues.set(session.sessionId, queue);

    if (queue.length === 2) {
      this.startGame(session.sessionId, queue);
    }
  }

  async startGame(sessionId: string, match: GameEntry[]) {
    const gameSessionId = randomUUID();

    const randomPlayers = match
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    const user1 = await this.usersService.findUnique({
      id: randomPlayers[0].playerId,
    });
    const user2 = await this.usersService.findUnique({
      id: randomPlayers[1].playerId,
    });

    if (user1 && user2) {
      const deck1 = (await this.decksService.findAll(user1.id)).find(
        (deck) => deck.id === user1.activeDeck,
      );

      const updatedCards1 = await Promise.all(
        JSON.parse(deck1.cards).map(async (cardId: string) => {
          const card = await this.cardsService.findOne({ id: cardId });
          return card;
        }),
      );
      const activeDeck1 = {
        ...deck1,
        cards: updatedCards1,
      };

      const deck2 = (await this.decksService.findAll(user2.id)).find(
        (deck) => deck.id === user2.activeDeck,
      );

      const updatedCards2 = await Promise.all(
        JSON.parse(deck2.cards).map(async (cardId: string) => {
          const card = await this.cardsService.findOne({ id: cardId });
          return card;
        }),
      );
      const activeDeck2 = {
        ...deck2,
        cards: updatedCards2,
      };

      const player1 = {
        uid: user1.id,
        name: user1.nickname,
        title: user1.title,
        character: user1.character,
        lifepoints: 40,
        deck: activeDeck1,
        hand: [],
        board: [],
        energy: [],
        graveyard: [],
      };
      const player2 = {
        uid: user2.id,
        name: user2.nickname,
        title: user2.title,
        character: user2.character,
        lifepoints: 40,
        deck: activeDeck2,
        hand: [],
        board: [],
        energy: [],
        graveyard: [],
      };

      const game = await this.gamesService.create({
        session: gameSessionId,
        state: JSON.stringify({
          players: [randomPlayers[0].playerId, randomPlayers[1].playerId],
          gamelog: { player1: player1, player2: player2, field: '', turn: '' },
        }),
        players: {
          connect: match.map((entry) => ({ id: entry.playerId })),
        },
      });

      if (game) {
        match.forEach((entry) => {
          entry.socket.emit('gameReady', gameSessionId);
        });
        this.queues.delete(sessionId);
      } else {
        throw Error;
      }
    }
  }

  async joinGame(socket: Socket, payload: string) {
    const session = JSON.parse(payload);
    const user = await this.usersService.findUnique({
      id: session.playerId,
    });

    const gameSession: { session: string; state: string; players: User[] } =
      (await this.gamesService.findUnique(session.sessionId)) as {
        session: string;
        state: string;
        players: User[];
      };
    if (!gameSession) {
      throw new NotFoundException();
    }
    if (
      gameSession.players[0].id !== user.id &&
      gameSession.players[1].id !== user.id
    ) {
      throw new ForbiddenException();
    }

    if (!this.games.has(session.sessionId)) {
      this.games.set(session.sessionId, []);
    }

    const game = this.games.get(session.sessionId);
    if (!game.some((player) => player.playerId === user.id)) {
      game.push({ socket, playerId: session.playerId });
      this.games.set(session.sessionId, game);
    }
    this.games.set(session.sessionId, game);
  }

  async gameAction(socket: Socket, payload: string) {
    console.log('receivedaction');
    const session = JSON.parse(payload);
    const user = await this.usersService.findUnique({
      id: session.playerId,
    });
    const gameSession: { session: string; state: string; players: User[] } =
      (await this.gamesService.findUnique(session.sessionId)) as {
        session: string;
        state: string;
        players: User[];
      };
    if (!gameSession) {
      throw new NotFoundException();
    }
    if (
      gameSession.players[0].id !== user.id &&
      gameSession.players[1].id !== user.id
    ) {
      throw new ForbiddenException();
    }

    const game = this.games.get(session.sessionId);
    const gameState = JSON.parse(gameSession.state);

    if (gameState.gamelog.player1.uid === session.actionTarget) {
      const newPlayerState = { ...gameState.gamelog.player1 };
      const newHandCard = newPlayerState.deck.cards.pop();
      if (newHandCard) {
        newPlayerState.hand.push(newHandCard);
      }
      gameState.gamelog.player1 = newPlayerState;
    } else if (gameState.gamelog.player2.uid === session.actionTarget) {
      const newPlayerState = { ...gameState.gamelog.player2 };
      const newHandCard = newPlayerState.deck.cards.pop();
      if (newHandCard) {
        newPlayerState.hand.push(newHandCard);
      }
      gameState.gamelog.player2 = newPlayerState;
    } else {
      throw new NotFoundException('Player not found');
    }

    switch (session.action) {
      case '[action_draw]':
        game.forEach((entry) => {
          entry.socket.emit(
            '[action_draw]',
            JSON.stringify({ target: session.actionTarget }),
          );
        });
        break;

      default:
        throw new NotFoundException('Not a valid action');
    }

    return this.gamesService.update({
      session: session.sessionId,
      data: { state: JSON.stringify(gameState) },
    });
  }
}
