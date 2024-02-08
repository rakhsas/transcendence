import User from "../model/user.model";


class UserService {
    async getUser(userId: number): Promise<any> {
        try {
            const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
                method: 'GET',
                credentials: "include"
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403)
                {
                    window.location.href = '/'
                    return ;
                }
                throw new Error('Request failed');
            }
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Request error:', error);
            throw error;
        }
    }
}

export default UserService;