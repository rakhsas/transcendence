import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express/multer/multer.module";
import { UploadController } from "./upload.controller";
import { diskStorage } from "multer";
import { UserGuard } from "src/guards/user.guard";
import { AuthService } from "src/auth/auth.service";
import { HttpModule } from "@nestjs/axios";
const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const randomName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
        cb(null, randomName);
    }
});

@Module({
    imports: [
        MulterModule.register({
            storage: storage,
            fileFilter: (req, file, cb) => {
                if (file.mimetype.match(/^(image|audio|video)\/(mp3|wav|jpeg|png|jpg|JPG|PNG|JPEG)$/)) {
                    cb(null, true);
                } else {
                    cb(new Error('Not a valid file'), false);
                }
            }
        }),
        HttpModule
    ],
    controllers: [UploadController],
    providers: [
        UserGuard, AuthService,
    ]
})
export class UploadModule {}