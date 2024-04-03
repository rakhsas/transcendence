import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express/multer/multer.module";
import { UploadController } from "./upload.controller";
import { diskStorage } from "multer";

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        // Replace spaces with underscores or remove them
        const filenameWithoutSpaces = file.originalname.replace(/\s/g, '_'); // Replace spaces with underscores
        // const filenameWithoutSpaces = file.originalname.replace(/\s/g, ''); // Remove spaces
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
        cb(null, filenameWithoutSpaces);
    }
});

@Module({
    imports: [
        MulterModule.register({
            storage: storage
        })
    ],
    controllers: [UploadController]
})
export class UploadModule {}