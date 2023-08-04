import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Productos } from '../models/productos';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Productos[]> {
    return this.http.get<Productos[]>('http://localhost:3000/productos');
  }

  guardar(producto:Productos):Observable<Productos>{

  return this.http.post<Productos>('http://localhost:3000/productos', producto)
  

  }

  modificar(producto: Productos): Observable<Productos> {
    return this.http
      .patch<Productos>('http://localhost:3000/productos', producto)
     
  }

  eliminar(id: number): Observable<Productos> {
    return this.http
      .delete<Productos>('http://localhost:3000/productos/' + id)
    
  }
}
