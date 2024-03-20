import { Injectable } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
@Injectable()
export class AppService {
  /**
   *
   */
  constructor(
  ) {}
  googleLogin(req) {
    if (!req.user) {
      return 'No User From Google.'
    }
    return {
      message: 'User info from Google',
      user: req.user
    }
  }
  githubLogin(req) {
    if (!req.user)
      return 'No user From Github.'
    return {
      message: 'Github info from Github',
      user: req.user
    }
  }
  hello() {
    return "Hello"
  }
  writeFileAsync = promisify(fs.writeFile);
  async uploadFile(file) {
    const { originalname, buffer } = file;
      const filename = `${Date.now()}-${originalname}`;
      const uploadDir = path.resolve(__dirname, 'uploads');
      const filePath = path.join(uploadDir, filename);
      await this.writeFileAsync(filePath, buffer);
    return {
      url: `${process.env.HOST}${filename}`
    }
  }
}
