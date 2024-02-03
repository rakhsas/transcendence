import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class AppService {
  uri = 'http://' + process.env.AUTHENTICATION_HOST + ':' + process.env.AUTHENTICATION_PORT +'/api/getHello';
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getHelloFromAuth(): Observable<AxiosResponse<any>> {
    try {
      return this.httpService
      .get(this.uri)
      .pipe(map(
        (response: AxiosResponse) => response.data));
      } catch (error) {
      console.error(error);
    }
    // console.log(this.httpService.get('http://localhost:3000/api/getHello'))
    // return this.httpService.get(this.uri);
  }
}
