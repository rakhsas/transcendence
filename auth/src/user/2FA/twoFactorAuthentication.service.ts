import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import {User} from './../entities/user.entity'
import { UserService } from '../user.service'
import { ConfigService } from '@nestjs/config';
import * as qr from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly usersService: UserService,
    private readonly configService: ConfigService
    ) {}
   public async generateTwoFactorAuthenticationSecret(userId: string, email: string) {
     const secret = authenticator.generateSecret();
     const otpauthUrl = authenticator.keyuri(email, 
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
      await this.usersService.setTwoFactorAuthenticationSecret(secret, userId);
      return otpauthUrl
    }
    public async pipeQrCodeStream(otpauthUrl: string) {
      return qr.toDataURL(otpauthUrl);
    }
    async isTwoFactorAuthenticationCodeValid(code: string,  user: User) {
      try {
        return authenticator.verify({
          token: code,
          secret: user.twoFactorAuthenticationSecret,
        })
      } catch (error) {
        return false;
      }
    }
}

