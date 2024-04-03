export class TwoFaService {
    async generateQrCode(userId: string, userEmail: string): Promise<any> {
        try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
            var Qrcode = await fetch(APIURL + `2fa/generate/${userId}/${userEmail}`, {
                    method: "GET",
                    credentials: "same-origin",
            });
            if (Qrcode.ok) {
                Qrcode = await Qrcode.json();
                return Qrcode.url;
            }
            else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Request error:', error);
            throw error;
        }
    }
}