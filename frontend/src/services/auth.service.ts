
class AuthService {
    async getPayload(): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + 'auth/decodeToken', {
                method: 'GET',
                // credentials: "omit"
                credentials: 'same-origin'
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

    async logout(): Promise<void> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + 'auth/logout', {
                method: 'GET',
                credentials: 'same-origin'
            });
            if (response.ok) {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return;
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

export default AuthService;