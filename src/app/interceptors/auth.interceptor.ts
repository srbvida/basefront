import {HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';
import {tap} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken'); //obtenemos el token del localStorage por si ya esta almacenado
  console.log('Token del localStorage:', token);

  let clonedRequest = req;

  // Si el token existe, agregamos el Authorization header para que este presente en el resto de peticiones http
  if (token) {
    console.log('Existe el token del localStorage lo pasamos por cabeceras:', token);
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Pasamos la solicitud (clonada u original) al siguiente manejador
  return next(clonedRequest).pipe(
    tap((event) => {
      // Si la respuesta contiene un nuevo token, lo actualizamos en el localStorage
      if (event instanceof HttpResponse && event.headers.has('Authorization')) {
        console.log(' Token de la response:', event.headers.get('Authorization'));
        const newToken = event.headers.get('Authorization')?.replace('Bearer ', '');
        if (newToken) {
          localStorage.setItem('authToken', newToken); // Actualizamos el token en el localStorage
          console.log('Token actualizado en localStorage:', newToken);
        }
      }else{
        console.log('No se encontró nuevo token en las cabeceras:');
      }
    })
  );
};
