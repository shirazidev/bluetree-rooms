import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isJWT } from 'class-validator';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token not found. Please log in.');
    }

    const user = await this.authService.validateAccessToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found.');
    }
    request.user = user;
    return true;
  }
  protected extractToken(request: Request): string | null {
    // 1. Check for token in Authorization header (for stateless clients)
    const { authorization } = request.headers;
    if (authorization && authorization.trim() !== '') {
      const [scheme, token] = authorization.split(' ');
      if (scheme.toLowerCase() === 'bearer' && token && isJWT(token)) {
        return token;
      }
    }

    // 2. Fallback to checking for token in cookies (for web clients)
    if (request.cookies && request.cookies.access_token) {
      const token = request.cookies.access_token;
      if (isJWT(token)) {
        return token;
      }
    }

    return null;
  }
}
