// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";

// import { Strategy, Profile } from "passport-github";
// import { UserService } from './user/user.service';

// import { ConfigService } from '@nestjs/config';
// import { use } from "passport";

// @Injectable()

// export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
// 	constructor(
// 		configService: ConfigService,
// 		private readonly userService: UserService
// 		) {
// 		super({
// 			clientID: configService.get('GITHUB_CLIENT_ID'),
// 			clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
// 			callbackURL: configService.get('GITHUB_CLIENT_CALLBACK_URL'),
// 			scope: [ 'user:email' ]
// 		});
// 	}
// 	async validate(accessToken: string, _refreshToken: string, profile: Profile): Promise<any> {
// 		try {
// 			const email = profile?.emails?.[0].value;
// 			const name = profile?.displayName?.value;
// 			const username = profile?.username?.value;
// 			const picture = profile?.photos?.[0].value;
// 			if (!email || !name || !username || !picture)
// 				throw new Error("Incomplete profile Information");
// 			const isEmailPrivate = profile?._json.email;
// 			const userEmail = isEmailPrivate ? 'private-email@example.com' : email;
// 			// const user = await this.userService.findOrCreateUser({
// 			// 	email: userEmail,
// 			// 	name,
// 			// 	username,
// 			// 	// password
// 			// })
// 			// return user;
// 		} catch (error) {
// 		}
// 	}
// }