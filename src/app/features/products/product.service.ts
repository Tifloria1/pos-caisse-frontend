import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8083/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any, categoryId: number): Observable<Product> {
  return this.http.post<Product>(
    `${this.apiUrl}/category/${categoryId}`,
    product
  );
}

updateProduct(id: number, product: any, categoryId: number): Observable<Product> {
  return this.http.put<Product>(
    `${this.apiUrl}/${id}/category/${categoryId}`,
    product
  );
}

toggleStatus(id: number): Observable<Product> {
  return this.http.patch<Product>(
    `${this.apiUrl}/${id}/toggle-status`,
    {}
  );
}

uploadProductImage(productId: number, file: File): Observable<Product> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post<Product>(
    `${this.apiUrl}/${productId}/image`,
    formData
  );
}


}