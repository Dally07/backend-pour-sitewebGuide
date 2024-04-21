import { Injectable, NestInterceptor, CallHandler, ExecutionContext, LoggerService } from "@nestjs/common";
import { response } from "express";
import { Observable } from "rxjs";
import { map , tap } from "rxjs";

@Injectable ()
export class authInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.metode;
        const url = request.url;


        this.logger.log(`request stored: ${method} ${url}` );


        return next.handle().pipe(
            tap(() => {
                this.logger.log(`request completed: ${method} ${url}`);
            }),
            map((response) => {
                this.logger.log(`response: ${response.statusMessage}`);
                return response;
            }) 
        )
    }
}