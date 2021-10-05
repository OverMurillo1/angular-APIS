import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiURL = 'https://young-sands-07814.herokuapp.com/api/products'

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts() {
    return this.http.get<Product[]>(this.apiURL);
  }

  getProducts(id: string){
    return this.http.get<Product>(`${this.apiURL}/${id}`);
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
}
