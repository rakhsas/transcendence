export class AnalyticsService{

    async fetchTop3(): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `analytics/top3`, {
                method: 'GET',
                credentials: 'same-origin',
            });
            if (response.ok) {
                const result = await response.json();
                return result;
            }
            else if (response.status === 401 || response.status === 403) {
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


    async otherPlayers(): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `analytics/allPlayers`, {
                method: 'GET',
                credentials: 'same-origin',
            });
            if (response.ok) {
                const result = await response.json();
                return result;
            }
            else if (response.status === 401 || response.status === 403) {
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

    async lastSevenDays(userId: string): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            const response = await fetch(APIURL + `analytics/lastSevenDays/${userId}`, {
                method: 'GET',
                credentials: 'same-origin',
            });
            if (response.ok) {
                const result = await response.json();
                return result;
            }
            else if (response.status === 401 || response.status === 403) {
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