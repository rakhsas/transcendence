import { Not, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { map, startWith } from 'rxjs';
import { AxiosResponse } from 'axios';
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { response } from "express";
import { SettingProfileDto } from "./dto/setting.user";
@Injectable()

export class UserService {
	constructor (
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly http: HttpService,
		// private readonly userRepository: Repository<User>,

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
		user.provider = createUser.provider;
		user.coalition = createUser.coalition;
		user.coalitionPic = createUser.coalitionPic;
		user.coalitionCover = createUser.coalitionCover;
		user.coalitionColor = createUser.coalitionColor;
		user.providerId = createUser.providerId;
		const object = await this.userRepository.save(user);
		return { user: object, firstLogin: true };
	}
	
	/**
	 * this functions is used to find all users from User Entity.
	*/
	async findAllUsers(): Promise<User[]> {
		return await this.userRepository.find();
	}

	/**
	 * this function is used to find user by id from User Entity.
	*/
	async viewUser(id: string): Promise<User | null> {
		try {
			return await this.userRepository.findOne({ where: { id } });
		} catch (error) {
			// Handle error gracefully
			console.error('Error fetching user:', error);
			return null;
		}
	}

	async updateUserSetting(userId: string, payload: SettingProfileDto) {
		//console.log("the user id is absolutly: ", userId);
		const existingData = await this.viewUser(userId);
		if (!existingData) {
			throw new Error('Data not found');
		}
		
		// //console.log("existing data: --------> ", existingData);
		existingData.firstName = payload.firstName;
		existingData.lastName = payload.lastName;
		existingData.email = payload.email;
		// //console.log("after existing data: --------> ", existingData);

		// //console.log("*-*-*-*-*-**> : ", existingData);
		return await this.userRepository.save(existingData);
	}

	async getUserById(id: string): Promise<User> {
		return this.userRepository.findOneBy({
			id
		})
	}
	/**
	 * this function is used to update user by id from User Entity.
	*/
	async update(id: string, updateUserDto: Partial<User>): Promise<User> {
		const user = await this.viewUser(id);
		if (!user) {
		  throw new Error('User not found');
		}
		Object.assign(user, updateUserDto); // Merge update data with existing user
		return this.userRepository.save(user);
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
	async findOne(userData: Partial<User>): Promise<any> {
		const { email, firstName, lastName, picture, username, providerId, provider } = userData;
		let user = await this.userRepository.findOneBy({ email, firstName, lastName, picture, username, providerId, provider });
		return (user) ? { user: user, firstLogin: false } : null;
	}

	async getCoalition(id: number, providerAccessToken: string): Promise<any> {
		const headers = {
			'Authorization': `Bearer ${providerAccessToken}`
		}
		try {
			const coalition = this.http.get(process.env.INTRA_USERS + id + '/coalitions', { headers })
				.pipe(map(
					(response: AxiosResponse) => {
						// //console.log(response.data);
						return response.data
					}
				))
				.toPromise();
				return coalition;
		} catch (error) {
			console.error(error);
		}
	}
	async getPicture(picture: string, providerAccessToken: string): Promise<File> {
        const headers = {
            'Authorization': `Bearer ${providerAccessToken}`
        };

        try {
			const response: AxiosResponse<ArrayBuffer> = await this.http.get(picture, { headers, responseType: 'arraybuffer' }).toPromise();
			const fileType = picture.split('.').pop() || 'jpg';
			const mimeType = `image/${fileType}`;
			const file = new File([response.data], `picture.${fileType}`, { type: mimeType });
			return file;
		} catch (error) {
			console.error(error);
			throw error;
		}
    }
	async findAllUsersExcept(id: string): Promise<User[]> {
		return await this.userRepository.find({
		where: {
			id: Not(id),
		},
		});
	}

  	async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
		return this.userRepository.update(userId, {
		  twoFactorAuthenticationSecret: secret
		});
	  }

	  async turnOnTwoFactorAuthentication(userId: string) {
		return this.userRepository.update(userId, {
		  isTwoFactorAuthenticationEnabled: true
		});
	}

	async findByUserName(username: string): Promise<User> {
		//console.log(username);
		return await this.userRepository.findOne({
			where: {
				username: username
			}
		})
	}

	async updateUsername(username: string, userId: string) : Promise<User>{
		await this.userRepository.update(userId, {
			username: username
		})
		return await this.viewUser(userId);
	}
	async updatePicture(userId: string, picPath: string) : Promise<User>{
		await this.userRepository.update(userId, {
			picture: picPath
		})
		return await this.viewUser(userId);
	}


	async update2FAState(userId: string, status: boolean) {
		const user = await this.viewUser(userId);
		if (!user) {
			throw new Error('User not found');
		}
		user.isTwoFactorAuthenticationEnabled = status;
		console.log("user: ", user);
		return await this.userRepository.save(user);
	}

	async searchUser(hint: string): Promise<User[]> {
		return await this.userRepository.createQueryBuilder('user')
			.where('LOWER(user.username) LIKE LOWER(:username)', { username: `${hint.toLowerCase()}%` })
			.orWhere('LOWER(user.firstName) LIKE LOWER(:firstName)', { firstName: `${hint.toLowerCase()}%` })
			.orWhere('LOWER(user.lastName) LIKE LOWER(:lastName)', { lastName: `${hint.toLowerCase()}%` })
			.getMany();
	}
}
