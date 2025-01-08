import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {TokenService} from '../token/token.service';

export const httpTokenInterceptor: HttpInterceptorFn = (req,
                                                        next) => {

  const tokenserService = inject(TokenService);
  const router = inject(Router);


  const access_Token = tokenserService.token;

  if (access_Token) {
    let updatedRequest = req;
    updatedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access_Token}`,
      },
    });
    return next(updatedRequest)
  }

  return next(req);

};
