import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { Response } from "express";
import { UserGuard } from "src/guards/user.guard";
import { ApiTags } from "@nestjs/swagger";
const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const extension = extname(file.originalname);
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extension}`);
    },
  });

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    constructor() {
    }


    @Post()
	@UseGuards(UserGuard)
    @UseInterceptors(FileInterceptor('file', {storage}))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (file) {
            return { url: `upload/${file.filename}` };
        } else {
            return { message: 'No file uploaded!' };
        }
    }

    @Get(':filename')
	@UseGuards(UserGuard)
    getImage(@Param('filename') filename: string, @Res() response: Response){
        const imagePath = join(__dirname, '..', 'uploads', filename);
        return response.sendFile(imagePath);
    }

    @Post('audio')
    @UseInterceptors(FileInterceptor('file', {storage}))
	@UseGuards(UserGuard)
    async uploadAudio(@UploadedFile() file: Express.Multer.File) {
        if (file) {
            return { url: `upload/${file.filename}` };
        } else {
            return { message: 'No file uploaded!' };
        }
    }

    @Get('audio/:filename')
	@UseGuards(UserGuard)
    getAudio(@Param('filename') filename: string, @Res() response: Response){
        const audioPath = join(__dirname, '..', 'uploads', filename);
        return response.sendFile(audioPath);
    }
}
