import User from "../model/user.model";


class UserService {
    async getUser(userId: number): Promise<any> {
        try {
            const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
                method: 'GET',
                credentials: "same-origin"
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }
}

export default UserService;