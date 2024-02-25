import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create.user";
import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { User1 } from "@prisma/client"
// import {User} from "./model/user.model"
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./dto/update.user";
import { User } from "./model/user.model";
@Injectable()

export class UserService {
	constructor (
		// @InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly http: HttpService,
		private readonly prisma: PrismaService
	) {
	}


	/**
	 * this is function is used to create User in User Entity.
	 * @param createUserDto this will type of createUserDto in which
	 * we have defined what are the keys we are expecting from body
	 * @returns promise of user
	*/
   	async createUser(createUser: Partial<User1>): Promise<any> {
		const user: User = new User();
		user.firstName = createUser.firstName;
		user.lastName = createUser.lastName;
		user.username = createUser.username;
		user.email = createUser.email;
		user.picture = createUser.picture;
		// user.provider = createUser.provider;
		user.coalition = createUser.coalition;
		user.coalitionPic = createUser.coalitionPic;
		user.coalitionCover = createUser.coalitionCover;
		user.coalitionColor = createUser.coalitionColor;
		user.id = createUser.id;
		const object = await this.prisma.user1.create({data: {
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
			email: user.email,
			picture: user.picture,
			// provider: user.provider,
			coalition: user.coalition,
			coalitionPic: user.coalitionPic,
			coalitionCover: user.coalitionCover,
			coalitionColor: user.coalitionColor,
			id: user.id
		}});
		// const object = await this.http.post(this.CHAT_URL + 'users', user).toPromise();
		return { user: object, firstLogin: true };
	}
	
	/**
	 * this functions is used to find all users from User Entity.
	*/
	async findAllUsers(): Promise<User1[]> {
		const users = await this.prisma.user1.findMany();
		return users;
	}

	/**
	 * this function is used to find user by id from User Entity.
	*/
	async viewUser(id: number): Promise<User1> {
		return await this.prisma.user1.findUnique({ where:{
			id: Number(id)
		} });
	}

	/**
	 * this function is used to update user by id from User Entity.
	*/
	updateUser( id: number, updateUser: UpdateUserDto ): Promise<User1> {
		return this.prisma.user1.update({
			where: { id: id },
			data: {
				firstName: updateUser.firstName,
				lastName: updateUser.lastName,
				username: updateUser.username,
				email: updateUser.email,
				picture: updateUser.picture,
				coalition: updateUser.coalition,
				coalitionPic: updateUser.coalitionPic,
				coalitionCover: updateUser.coalitionCover,
				coalitionColor: updateUser.coalitionColor,
				id: updateUser.id
			}
		});
	}

	/**
	 * this function is used to delete user by id from User Entity.
	*/
	// deleteUser(id: number): Promise<{ affected?: number }> {
	// 	return this.userRepository.delete(id);
	// }

	// async findOrCreateUser(userData: Partial<User>): Promise<any> {
	// 	let firstLogin: boolean = false;
	// 	const { email, firstName, lastName, picture, username, id, provider, coalition, coalitionPic, coalitionCover, coalitionColor } = userData;
	
	// 	// Check if the user already exists
	// 	let user = await this.userRepository.findOne({ where: { email, firstName, lastName, picture, username, id, provider, coalition, coalitionPic, coalitionCover, coalitionColor } });
	
	// 	// If the user doesn't exist, create a new user
	// 	if (!user) {
	// 	  	user = await this.userRepository.save(userData);
	// 		firstLogin = true;
	// 	}
	// 	return {user, firstLogin};
	// }

	// async findOne(userData: Partial<User>): Promise<any> {
	async findOne(userData: Partial<User1>): Promise<any> {
		const { email, firstName, lastName, picture, username, id, coalition, coalitionPic, coalitionCover, coalitionColor } = userData;
		 let user = await this.prisma.user1.findUnique({ where: { id, email, firstName, lastName, picture, username, coalition, coalitionPic, coalitionCover, coalitionColor } });
		return (user) ? { user: user, firstLogin: true } : null;
	}

	async getCoalition(id: number, providerAccessToken: string): Promise<any> {
		const headers = {
			'Authorization': `Bearer ${providerAccessToken}`
		}
		try {
			const coalition = this.http.get('https://api.intra.42.fr/v2/users/' + id + '/coalitions', { headers })
				.pipe(map(
					(response: AxiosResponse) => {
						// console.log(response.data);
						return response.data
					}
				))
				.toPromise();
				return coalition;
			// console.log(coalition);
			return coalition;
		} catch (error) {
			console.error(error);
		}
	}
}