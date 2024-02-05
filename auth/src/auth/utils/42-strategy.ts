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
            const email = profile?.emails?.[0]?.value;
            const firstName = profile?.name?.givenName;
            const lastName = profile?.name?.familyName;
            const picture = profile?._json.image?.link;
            const username = profile?.username;
            const id = profile.id;
            const provider = profile.provider;
            var user = await this.userService.findOne({ email, firstName, lastName, picture, username, id, provider });
            if (!user) {
                const coalitionObject = await this.userService.getCoalition(id, accessToken);
                const coalition = coalitionObject[0].name;
                const coalitionPic = coalitionObject[0].image_url;
                const newUser = await this.userService.createUser({ email, firstName, lastName, picture, username, id, provider, coalition, coalitionPic });
                user = newUser;
            }
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
}