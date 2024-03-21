export class ChannelService {
    async latestChannels(userId: string): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            // console.log(APIURL + `messages/${userId}`);
            // const response = await fetch("https://10.13.249.229/api/messages", 
            const response = await fetch(APIURL + `channels/channels/${userId}`, 
            {
                method: 'GET',
                credentials: 'include'
            }
            );
            // console.log(response);
            if (response.ok) {
                const messages = await response.json();
                console.log(messages)
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