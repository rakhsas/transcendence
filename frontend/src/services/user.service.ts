import User from "../model/user.model";

class UserService {
    async getUser(token: string, userId: number): Promise<User> {
        const response = await fetch(`http:://localhost:3000/api/user/${userId}`);
        if (! response)
            throw new Error('Failed to retrieve user data');
        return await response.json();
    }

    async login(): Promise<any> {
        const response = await fetch(`http://localhost:3000/api/auth/42/login`);
        if (!response.ok) {
            throw new Error('Failed to login');
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            throw new Error('Unexpected response format');
        }
    }
}

export default UserService;