import { ArgumentMetadata, ArgumentsHost, BadRequestException, ExceptionFilter, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";


export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype))
            return value;
        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            const errorMessages = this.extractErrorMessages(errors)
            throw new BadRequestException(`${errorMessages}`);
        }
        return value;
    }

    private toValidate(metatype: Function): Boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
    private extractErrorMessages(errors: ValidationError[]): string {
        for (const err of errors)
        {
            if (err.constraints && Object.values(err.constraints).length > 0)
                return Object.values(err.constraints)[0];
            if (err.children && err.children.length > 0)
            {
                const childErrorMessage = this.extractErrorMessages(err.children);
                if (childErrorMessage)
                    return childErrorMessage;
            }
        }
        return '';
    }
}

export class ValidationFilter < T > implements ExceptionFilter {
    catch (exception: T, host: ArgumentsHost) {
        if (exception instanceof BadRequestException) {
          const response = host.switchToHttp().getResponse();
          response.status(exception.getStatus())
            .json(exception.getResponse());
        }
      }
}