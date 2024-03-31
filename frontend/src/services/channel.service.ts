export class ChannelService {
    async latestChannels(userId: string): Promise<any> {
        try {
        	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `channels/${userId}`, 
            {
                method: 'GET',
                credentials: 'same-origin'
            }
            );
            // console.log(response);
            if (response.ok) {
                const messages = await response.json();
                return messages;
            }
            else if (response.status === 401 || response.status === 403)
            {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return ;
            }
            else {
                console.log(APIURL + `channels/lastMessage/${userId}`);
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Request error:', error);
            window.location.href = '/';
            document.cookie = 'provider_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            throw error;
        }
    }

    async getChannelMessages(channelId: number): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `channels/${channelId}/allMessages`, 
            {
                method: 'GET',
                credentials: 'same-origin'
            }
            );
            if (response.ok) {
                const messages = await response.json();
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

    async getProtectedChannels(): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `channels/protected`, 
            {
                method: 'GET',
                credentials: 'same-origin'
            }
            );
            if (response.ok) {
                const messages = await response.json();
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
    async getPublicChannels(userId: string): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `channels/public/rooms/${userId}`, 
            {
                method: 'GET',
                credentials: 'same-origin'
            }
            );
            if (response.ok) {
                const messages = await response.json();
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
    async getChannelMembers(channelId: number): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `channels/${channelId}/users`, 
            {
                method: 'GET',
                credentials: 'same-origin'
            }
            );
            if (response.ok) {
                const messages = await response.json();
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
    async getProtectedChannelsExpectUser(userId: string): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `channels/protected/${userId}`, 
            {
                method: 'GET',
                credentials: 'same-origin'
            }
            );
            if (response.ok) {
                const messages = await response.json();
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
