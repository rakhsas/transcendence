

//     async updateUserInfo(userId: string, userUpdate: SettingProfileDto): Promise<any> {

export class SettingService {
    async updateUserInfo(userId: string, userUpdate: any): Promise<any> {
        //console.log("userId and userUpdate: ", userId, userUpdate);
		console.log("userUpdate: ", userUpdate);
		try {
            const APIURL = import.meta.env.VITE_API_AUTH_KEY;
		  const response = await fetch(APIURL + `user/settingProfile/${userId}`, {
			method: 'PUT',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(userUpdate),
		  });
	  
		  if (response.ok) {
			// Handle successful update (e.g., display success message)
			//console.log('User information updated successfully!');
			// You might want to reset the form data here
		  } else {
			// Handle potential errors (e.g., display error message)
			console.error('Failed to update user information:', await response.text());
		  }
		} catch (error) {
		  console.error('Error during update:', error);
		}
};
}