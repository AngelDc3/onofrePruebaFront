import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '@features/checkout/services/checkout.service';
import { Articulo } from '@shared/models/articulo.interface';
import { CartStore } from '@shared/store/shopping-cart.store';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './checkout.component.html',
})
export default class CheckoutComponent {
  cartStore = inject(CartStore);
  items: Articulo[] = this.cartStore.products();
  toastSvc = inject(ToastrService);
  router = inject(Router);
  cookieSvc = inject(CookieService);
  private readonly _checkoutSvc = inject(CheckoutService);

  constructor() {
  }

  onProceedToPay(): void {
    console.log("Proceed to pay", this.cookieSvc.check('token'))
    if (!this.cookieSvc.check('token')) {
      this.toastSvc.error('Tienes que iniciar sesión para continuar', 'Onofre STORE');
    }
    else {

      this._checkoutSvc.onProceedToPay(this.items, this.cartStore.totalAmount()).subscribe({
        next: (data: any) => {
          console.log(data)
          this.toastSvc.success('Payment successful', 'Onofre STORE');
          window.location.href = data.payUrl;

          //todo hacer pagina de pedidos y configurar la redireccion en el panel de control de la pasarela de pagos
        },
        error: (err) => {
          this.toastSvc.error('Payment failed', 'Onofre STORE');
          console.error(err);
        },
      });
    }
  }

  removeItem(id: number): void {
    this.cartStore.removeFromCart(id);
  }

  clearAll(): void {
    this.cartStore.clearCart();
  }
}
