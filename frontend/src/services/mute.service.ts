import { MutedUsers } from "../utils/types";

class MuteService {
    async MutedUsers(channelId: number): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `mute/${channelId}`, 
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

export default MuteService;