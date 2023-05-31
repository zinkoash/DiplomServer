import { NestMiddleware } from '@nestjs/common';

export class CorsMiddleware implements NestMiddleware {
    use(req: any, res: any, next: (error?: any) => void) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept',
        );
        next();
    };
}
