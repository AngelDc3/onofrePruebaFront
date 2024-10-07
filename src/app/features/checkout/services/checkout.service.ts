import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@envs/environment';
import { Articulo } from '@shared/models/articulo.interface';
import { Product } from '@shared/models/product.interface';
import { loadStripe } from '@stripe/stripe-js';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly _http = inject(HttpClient);
  private readonly _url = environment.apiURL;


  onProceedToPay(products: Articulo[], total: number) {
    return this._http.post(`${this._url}/order/pay`, { items: products, total });

  }
}
