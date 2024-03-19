import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessJwtService, RefreshJwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private accessJwtService: AccessJwtService,
    private refreshJwtService: RefreshJwtService,
    // private jwtService: JwtService,
  ) {}

  async signIn(
    nickname: string,
    password: string,
  ): Promise<{ uid: string; access_token: string; refresh_token: string }> {
    const user = await this.usersService.findUnique({ nickname: nickname });
    if (!user) {
      throw new NotFoundException();
    }
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const accessPayload = { sub: user.id, email: user.email };
    const refreshPayload = { sub: user.id, nickname: user.nickname };
    return {
      uid: user.id,
      access_token: await this.accessJwtService.sign(accessPayload),
      refresh_token: await this.refreshJwtService.sign(refreshPayload),
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.refreshJwtService.verify(token);
      const accessPayload = { sub: payload.id, email: payload.email };
      const refreshPayload = { sub: payload.id, email: payload.email };
      return {
        access_token: await this.accessJwtService.sign(accessPayload),
        refresh_token: await this.refreshJwtService.sign(refreshPayload),
      };
    } catch {
      throw new UnauthorizedException();
    }
    // return null;
  }
}
