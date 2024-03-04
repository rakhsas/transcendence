
class AuthService {
    async getPayload(): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + 'auth/decodeToken', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const userData = await response.json();
                return userData;
            }
            else if (response.status === 401 || response.status === 403)
            {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return ;
            }
            else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Request error:', error);
            window.location.href = '/';
            document.cookie = 'provider_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            throw error;
        }
    }
}

export default AuthService;