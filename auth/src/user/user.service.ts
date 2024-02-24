import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create.user";
import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { AxiosResponse } from 'axios';
import User from "./model/user.model"
@Injectable()

export class UserService {
	// CHAT_URL = process.env.CHAT_URL;
	CHAT_URL = process.env.CHAT_HOST;
	constructor (
		// @InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly http: HttpService
	) {
	}


	/**
	 * this is function is used to create User in User Entity.
	 * @param createUserDto this will type of createUserDto in which
	 * we have defined what are the keys we are expecting from body
	 * @returns promise of user
	*/
   	async createUser(createUser: Partial<User>): Promise<any> {
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
		// const object = await this.userRepository.save(user);
		const object = await this.http.post(this.CHAT_URL + 'users', user).toPromise();
		return { user: object, firstLogin: true };
	}
	
	/**
	 * this functions is used to find all users from User Entity.
	*/
	findAllUsers(): Promise<User[]> {
		// return this.userRepository.find();
		return this.http.get(this.CHAT_URL + 'users').pipe(map(response => response.data)).toPromise();
	}

	/**
	 * this function is used to find user by id from User Entity.
	*/
	async viewUser(id: Number): Promise<any> {
		// return await this.userRepository.findOne({ where: {id: id} });
		return await this.http.get(this.CHAT_URL + 'users/' + id).pipe(map(response => response.data)).toPromise();
	}

	/**
	 * this function is used to update user by id from User Entity.
	*/
	// updateUser(
	// 	id: string,
	// 	updateUser: CreateUserDto
	// ): Promise<User> {
	// 	return this.userRepository.save({
	// 		id: id,
	// 		...updateUser
	// 	});
	// }

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
	async findOne(id: Number): Promise<any> {
		// const { email, firstName, lastName, picture, username, id, coalition, coalitionPic, coalitionCover, coalitionColor } = userData;
		let user = await this.http.get(this.CHAT_URL + 'users/' + id).pipe(map(response => response.data)).toPromise();
		//  this.userRepository.findOne({ where: { email, firstName, lastName, picture, username, id, coalition, coalitionPic, coalitionCover, coalitionColor } });
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