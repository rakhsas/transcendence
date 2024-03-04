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
            callbackURL: process.env.FORTYTWO_CLIENT_CALLBACK_URL,
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
            const providerId = profile.id;
            const provider = profile.provider;
            var Object = await this.userService.findOne({ email, firstName, lastName, picture, username, providerId, provider});
            if (!Object) {
                const coalitionObject = await this.userService.getCoalition(providerId, accessToken);
                const coalition = coalitionObject[0].name;
                const coalitionPic = coalitionObject[0].image_url;
                const coalitionCover = coalitionObject[0].cover_url;
                const coalitionColor = coalitionObject[0].color;
                const newUser = await this.userService.createUser({ email, firstName, lastName, picture, username, providerId, coalition, coalitionPic, coalitionCover, coalitionColor, provider });
                Object = newUser;
            }
            const shortLivedAccessToken = await this.authService.generateAccessToken(Object.user);
            return {
                user: Object.user,
                firstLogin: Object.firstLogin,
                appAccessToken: shortLivedAccessToken,
                providerAccessToken: accessToken
            }
        } catch (error) {
            done(error, false);
        }
    }
}