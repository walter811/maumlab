import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Invalid user');
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const payload = { email: user.email, sub: user.id };
      return { accessToken: this.jwtService.sign(payload) };
    }
    return null;
  }
}
