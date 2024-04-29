// import User from "../model/user.model";


class UserService {
    async getUser(userId: string): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `user/${userId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const userData = await response.json();
			    // //console.log("fetchedUserData: ", userData)
                return userData;
            }
            else if (response.status === 401 || response.status === 403)
            {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return ;
            }
            else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Request error:', error);
            window.location.href = '/';
            document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            throw error;
        }
    }
    async getAllUsersExcept(userId: string): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `user/all/${userId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const users = await response.json();
                return users;
            }
            else if (response.status === 401 || response.status === 403)
            {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return ;
            }
            else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Request error:', error);
            window.location.href = '/';
            document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            throw error;
        }
    }

    async updateUsername(username: string, userId: string): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `info/user/${username}/${userId}`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (response.ok) {
                const userData = await response.json();
                return userData;
            }
            else if (response.status === 401 || response.status === 403)
            {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return ;
            }
            else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Request error:', error);
            window.location.href = '/';
            document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            throw error;
        }
    }

    async updateUserPicture(userId: string, file: File): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch(APIURL + `user/picture/${userId}`, {
                method: 'PUT',
                credentials: 'same-origin',
                body: formData
            });
            if (response.ok) {
                const userData = await response.json();
                return userData;
            }
            else if (response.status === 401 || response.status === 403)
            {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return ;
            }
            else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Request error:', error);
            window.location.href = '/';
            document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            throw error;
        }
    }
}

export default UserService;