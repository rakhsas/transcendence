import { PassportStrategy } from '@nestjs/passport';
import { Strategy} from 'passport-github2';
import { UserService } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    try {
      // Extract necessary information from the GitHub profile
      const email = profile?.emails?.[0]?.value;
      const username = profile?.username;
      const id = profile.id;
      const provider = profile.provider;
      const picture = profile?._json?.avatar_url;
      const firstName = profile?.name?.familyName;
      const lastName = profile?.name?.givenName;

      // Find or create the user in the database
      const user = await this.userService.findOrCreateUser({
        email,
        username,
        id,
        provider,
        picture,
        firstName,
        lastName
      });
      const shortLivedAccessToken = await this.authService.generateAccessToken(
        user,
      );
      return {
        user: user.user,
        firstLogin: user.firstLogin,
        appAccessToken: shortLivedAccessToken,
        providerAccessToken: accessToken,
      };
    } catch (error) {
      done(error, false);
    }
  }

  serializeUser(user: any, done: Function) {
    done(null, user.id);
  }

  deserializeUser(id: any, done: Function) {
    this.userService.viewUser(id)
      .then((user) => done(null, user))
      .catch((error) => done(error));
  }
}