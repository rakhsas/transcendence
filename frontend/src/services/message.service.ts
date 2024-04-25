class MessageService {
    async latestMessages(userId: string): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `messages/${userId}`, 
            {
                method: 'GET',
                credentials: 'same-origin'
            }
            );
            // //console.log(response);
            if (response.ok) {
                const messages = await response.json();
                // //console.log(response)
                return messages;
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
    async getMessages(userId: string, friendId: string): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `messages/${userId}/${friendId}`, 
            {
                method: 'GET',
                credentials: 'include'
            }
            );
            if (response.ok) {
                const messages = await response.json();
                return messages;
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
    
    async BlockedUsers(userId: string, friendId: string): Promise<boolean> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            //console.log(APIURL + `Blocked/${userId}/${friendId}`);
            const response = await fetch(APIURL + `Blocked/${userId}/${friendId}`,
            {
                method: 'GET',
                credentials: 'include'
            }
            );
            if (response.ok) {
                const blocked = await response.json();
                return blocked;
            }
            else if (response.status === 401 || response.status === 403)
            {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; access_token=; twoFactorAuthentication=; firstLogin=; isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return false;
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

export default MessageService;