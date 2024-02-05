import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create.user";
import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()

export class UserService {
	constructor (
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly http: HttpService
	) {
	}


	/**
	 * this is function is used to create User in User Entity.
	 * @param createUserDto this will type of createUserDto in which
	 * we have defined what are the keys we are expecting from body
	 * @returns promise of user
	*/
   	async createUser(createUser: CreateUserDto): Promise<any> {
		const user: User = new User();
		user.firstName = createUser.firstName;
		user.lastName = createUser.lastName;
		user.username = createUser.username;
		user.email = createUser.email;
		user.picture = createUser.picture;
		user.provider = createUser.provider;
		user.coalition = createUser.coalition;
		user.coalitionPic = createUser.coalitionPic;
		user.id = createUser.id;
		const object = await this.userRepository.save(user)
		return { object, firstLogin: true };
	}
	
	/**
	 * this functions is used to find all users from User Entity.
	*/
	findAllUsers(): Promise<User[]> {
		return this.userRepository.find();
	}

	/**
	 * this function is used to find user by id from User Entity.
	*/
	viewUser(id: string): Promise<User> {
		return this.userRepository.findOne({ where: {id: id} });
	}

	/**
	 * this function is used to update user by id from User Entity.
	*/
	updateUser(
		id: string,
		updateUser: CreateUserDto
	): Promise<User> {
		return this.userRepository.save({
			id: id,
			...updateUser
		});
	}

	/**
	 * this function is used to delete user by id from User Entity.
	*/
	deleteUser(id: number): Promise<{ affected?: number }> {
		return this.userRepository.delete(id);
	}

	async findOrCreateUser(userData: Partial<User>): Promise<any> {
		let firstLogin: boolean = false;
		const { email, firstName, lastName, picture, username, id, provider, coalition, coalitionPic } = userData;
	
		// Check if the user already exists
		let user = await this.userRepository.findOne({ where: { email, firstName, lastName, picture, username, id, provider, coalition, coalitionPic } });
	
		// If the user doesn't exist, create a new user
		if (!user) {
		  	user = await this.userRepository.save(userData);
			firstLogin = true;
		}
		return {user, firstLogin};
	}

	async findOne(userData: Partial<User>): Promise<any> {
		const { email, firstName, lastName, picture, username, id, provider, coalition, coalitionPic } = userData;
		let user = await this.userRepository.findOne({ where: { email, firstName, lastName, picture, username, id, provider, coalition, coalitionPic } });
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
						console.log(response.data);
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