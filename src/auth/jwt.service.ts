import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessJwtService {
  constructor(private jwtService: JwtService) {}

  async sign(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '60d',
    });
  }

  async verify(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    return payload;
  }
}

@Injectable()
export class RefreshJwtService {
  constructor(private jwtService: JwtService) {}

  async sign(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '60d',
    });
  }

  async verify(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.REFRESH_SECRET,
    });
    return payload;
  }
}
