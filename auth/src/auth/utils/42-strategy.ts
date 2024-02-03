import { PassportStrategy } from "@nestjs/passport";

// import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Strategy } from 'passport-42';

import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { AuthService } from "../auth.service";

@Injectable()

export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {
        super({
            callbackURL: 'http://localhost:3000/api/auth/42/callback',
            clientID: process.env.FORTYTWO_CLIENT_ID,
            clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function
    ) {
        try {
            // Check if email, name, and photos exist in the profile
            const email = profile?.emails?.[0]?.value;
            const firstName = profile?.name?.familyName;
            const lastName = profile?.name?.givenName;
            const picture = profile?._json.image?.link;
            const username = profile?.username;
            const id = profile.id;
            const provider = profile.provider;
            const user = await this.userService.findOrCreateUser({email, firstName, lastName, picture, username, id, provider })
            // console.log("user :", user)
            const shortLivedAccessToken = await this.authService.generateAccessToken(user);
            return {
                user: user.user,
                firstLogin: user.firstLogin,
                appAccessToken: shortLivedAccessToken,
                providerAccessToken: accessToken
            }
        } catch (error) {
            done(error, false);
        }
    }

    serializeUser(user: any, done: Function) {
        done(null, user.id);
    }
    
    deserializeUser(id: any, done: Function) {
    this.userService.viewUser(id)
        .then(user => done(null, user))
        .catch(error => done(error));
    }
}