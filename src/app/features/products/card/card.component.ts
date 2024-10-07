import { CurrencyPipe, SlicePipe } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Articulo } from '@shared/models/articulo.interface';
import { Product } from '@shared/models/product.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CurrencyPipe, SlicePipe, RouterLink],
  template: `
    <div
      class="p-4 mt-2 mb-6 overflow-hidden rounded-b-lg shadow-none hover:shadow-xl"
    >
      <a
        class="relative block h-48 overflow-hidden rounded"
        [routerLink]="['/products', product().idarticulo]"
      >
        <img
          class="w-full transition duration-500 transform hover:scale-105"
          src="{{ product().imagenurl }}"
          alt="{{ product().titulo }}"
        />
      </a>

      <div class="mt-4">
        <h2 class="py-4 text-lg font-medium text-gray-900 title-font">
          <a [routerLink]="['/products', product().idarticulo]"
            >{{ product().titulo | slice : 0 : 30 }}
          </a>
        </h2>
        <div class="flex items-center justify-between mt-1">
          <p class="text-2xl font-bold text-orange-500">
            {{ product().precio | currency }}
          </p>
          <button
            (click)="onAddToCart()"
            class="px-2 py-1 text-white bg-orange-500 rounded hover:bg-orange-700"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CardComponent {
  product = input.required<Articulo>();
  @Output() addToCartEvent = new EventEmitter<Articulo>();

  onAddToCart(): void {
    this.addToCartEvent.emit(this.product());
  }
}
