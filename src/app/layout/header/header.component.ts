import { CurrencyPipe, NgClass, NgIf, SlicePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '@api/login.service';
import { CartStore } from '@shared/store/shopping-cart.store';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass, CurrencyPipe, SlicePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  showCart = signal<boolean>(false);
  cartStore = inject(CartStore);
  toastSvc = inject(ToastrService);
  loginSvc = inject(LoginService);
  cookieSvc = inject(CookieService);
  fb = inject(FormBuilder);
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  login(): void {
    this.loginSvc.login(this.loginForm.get('email')?.value || '', this.loginForm.get('password')?.value || '').subscribe({
      next: (data: any) => {
        this.toastSvc.success('Logged in', 'Onofre STORE');
        this.cookieSvc.set('token', data.token);

      },
      error: (err) => {
        this.toastSvc.error(err, 'Onofre STORE');
      },
    })
  }

  isloggedIn(): boolean {
    return this.cookieSvc.check('token');
  }

  logOut(): void {
    this.cookieSvc.delete('token');
    this.toastSvc.info('Logged out', 'Onofre STORE');
  }

}
