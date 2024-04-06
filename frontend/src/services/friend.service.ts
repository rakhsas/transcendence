export class FriendsService {
    async getFriends(userId: string): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + 'friends/' + userId, 
            {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const friends = await response.json();
                return friends;
            }
            else if (response.status === 404)
            {
                return [];
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
            // //console.log('APIURL: ', APIURL + 'friends/' + userId)
            console.error('Request error:', error);
            window.location.href = '/';
            document.cookie = 'provider_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            throw error;
        }
    }
}