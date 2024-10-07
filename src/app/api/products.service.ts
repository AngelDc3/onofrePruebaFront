import { HttpClient } from '@angular/common/http';
import {
  EnvironmentInjector,
  Injectable,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '@envs/environment';
import { Articulo } from '@shared/models/articulo.interface';
import { CookieService } from 'ngx-cookie-service';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  public products = signal<Articulo[]>([]);
  private readonly _http = inject(HttpClient);
  private readonly _endPoint = environment.apiURL;
  private readonly _injector = inject(EnvironmentInjector);
  cookiesvc = inject(CookieService);
  constructor() {
    this.getProducts();
  }

  public getProducts(): void {
    this._http
      .get<Articulo[]>(`${this._endPoint}/item`)
      .pipe(
        map((products: Articulo[]) =>
          products.map((product: Articulo) => ({ ...product }))
        ),
        tap((products: Articulo[]) => this.products.set(products))
      )
      .subscribe();
  }

  public getProductById(id: number) {
    return runInInjectionContext(this._injector, () =>
      toSignal<Articulo>(
        this._http.get<Articulo>(`${this._endPoint}/item/${id}`)
      )
    );
  }

  public generateOrder(products: Articulo[]) {
    return this._http.post(`${this._endPoint}/order`, products);
  }
}
