export class GameService {
    async GetScoreMatches(userId: string): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `analytics/allGame/${userId}`, {
                method: 'GET',
                credentials: 'same-origin',
            });
            if (response.ok) {
                const result = await response.json();
                return result;
            }
            else if (response.status === 401 || response.status === 403) {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return;
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

    async getTotalMatches(userId: string): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `analytics/${userId}`, {
                method: 'GET',
                credentials: 'same-origin',
            });
            if (response.ok) {
                const result = await response.json();
                return result;
            }
            else if (response.status === 401 || response.status === 403) {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return;
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


    

    async getLastGame(userId: string): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `analytics/lastGame/${userId}`, {
                method: 'GET',
                credentials: 'same-origin',
            });
            if (response.ok) {
                const result = await response.json();
                return result;
            }
            else if (response.status === 401 || response.status === 403) {
                window.location.href = '/';
                document.cookie = 'provider_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                return;
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