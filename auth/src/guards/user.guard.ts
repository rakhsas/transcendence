import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { AxiosResponse, AxiosError } from 'axios';
import { JwtService } from "@nestjs/jwt/dist";

@Injectable()

export class UserGuard implements CanActivate {
	URI = process.env.FORTYTWO42TOKENINFO
	/**
	 *
	 */
	constructor(
		private readonly authService: AuthService,
		private readonly httpService: HttpService,
        private jwtService: JwtService

	) { }
	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const request = context.switchToHttp().getRequest();
			const { cookie } : any = request.headers;
			const authToken = this.authService.getCookie('access_token', cookie);
			const providerToken = this.authService.getCookie('provider_access_token', cookie);
			if ( !authToken || authToken.length == 0 || !providerToken || providerToken.length == 0 ) {
				throw new UnauthorizedException('Please provide a token');
			}
			try {
				const [ authTokenPayload, providerAccessTokenValidity ] = await Promise.all([
					this.jwtService.verifyAsync(authToken, {
						secret: process.env.JWTSECRET
					}),
					this.checkFortyTwoTokenValidity(providerToken).toPromise()
				]);
				request.user = authTokenPayload;
            } catch {
                throw new UnauthorizedException();
            }
			return true;
		} catch ( error ) {
			//console.log( 'user error - ', error.message );
			throw new ForbiddenException(error.message || 'session expired! Please Sign In');
		}
	}

	checkFortyTwoTokenValidity(token: string): Observable<AxiosResponse<any>> {
		try {
			const response = this.httpService.get(this.URI, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			.pipe(
				catchError(
					(error: AxiosError) => {
						// Handle HTTP errors (including non-2xx status codes) here
						console.error('Error occurred during token validation:', error.response?.status);
						if (error.response?.status === 401) {
							throw new ForbiddenException('Token validation failed');
						}
						return throwError(error);
					}
				)
			);
			// //console.log(token)
			return response;
		} catch (error) {
		  console.error('Error occurred during token validation:', error);
		  throw error;
		}
	  }
}