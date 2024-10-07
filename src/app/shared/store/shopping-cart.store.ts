import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Articulo } from '@shared/models/articulo.interface';
import { Product } from '@shared/models/product.interface';
import { ToastrService } from 'ngx-toastr';

export interface CartStore {
  products: Articulo[];
  totalAmount: number;
  productsCount: number;
}

const initialState: CartStore = {
  products: [],
  totalAmount: 0,
  productsCount: 0,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ products }) => ({
    productsCount: computed(() => calculateProductCount(products())),
    totalAmount: computed(() => calculateTotalAmount(products())),
  })),
  withMethods(({ products, ...store }, toastSvc = inject(ToastrService)) => ({
    addToCart(product: Articulo) {
      const isProductInCart = products().find(
        (item: Articulo) => item.idarticulo === product.idarticulo
      );

      if (isProductInCart) {
        isProductInCart.cantidad++;
        isProductInCart.subtotal = isProductInCart.cantidad * isProductInCart.precio;
        patchState(store, { products: [...products()] });
      } else {
        patchState(store, { products: [...products(), product] });
      }
      toastSvc.success('Product added', 'DOMINI STORE');
    },
    removeFromCart(id: number) {
      const updatedProducts = products().filter((product) => product.idarticulo !== id);
      patchState(store, { products: updatedProducts });
      toastSvc.info('Product removed', 'DOMINI STORE');
    },
    clearCart() {
      patchState(store, initialState);
      toastSvc.info('Cart cleared', 'DOMINI STORE');
    },
  }))
);

function calculateTotalAmount(products: Articulo[]): number {
  return products.reduce(
    (acc, product) => acc + product.precio * product.cantidad,
    0
  );
}

function calculateProductCount(products: Articulo[]): number {
  return products.reduce((acc, product) => acc + product.cantidad, 0);
}
