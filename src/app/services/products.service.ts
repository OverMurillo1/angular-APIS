import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip  } from 'rxjs';

import { environment } from './../../environments/environment';
import { checkTime } from './../interceptors/time.interceptor';

import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiURL = `${environment.api_url}/api/products`;

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?:number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offsset', offset);
    }
    return this.http.get<Product[]>(this.apiURL, {params, context: checkTime() })
    .pipe(
      retry(3),
      map(products => products.map( item => {
        return{
          ...item,
          taxes: .19*item.price
        }
      }))
    );
  }

  getProducts(id: string){
    return this.http.get<Product>(`${this.apiURL}/${id}`).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === HttpStatusCode.Conflict){
          return throwError('Fallo en el server');
        }if(error.status === HttpStatusCode.NotFound){
          return throwError('Producto no existe');
        }if(error.status === HttpStatusCode.Unauthorized){
          return throwError('Estas autorizado');
        }
        return throwError('Algo salio mal');
      })
    )
  }

  getProductsByPage( limit: number, offset:number){
    return this.http.get<Product[]>(`${this.apiURL}`, {
      params: {limit, offset}
    });
  }

  create(data: CreateProductDTO){
    return this.http.post<Product>(this.apiURL, data);
  }

  update(dto: UpdateProductDTO, id: string){
    return this.http.put<Product>(`${this.apiURL}/${id}`, dto);
  }

  delete(id: string){
    return this.http.delete<boolean>(`${this.apiURL}/${id}`);
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO){
    return zip(
      this.getProducts(id),
      this.update(dto, id)
    );
  }

}
