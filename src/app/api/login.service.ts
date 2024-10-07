import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment";

@Injectable({ providedIn: 'root' })
export class LoginService {


    private readonly _http = inject(HttpClient);

    private readonly _endPoint = environment.apiURL;


    public login(email: string, password: string) {
        return this._http.post(`${this._endPoint}/auth/login`, { email, password });
    }
}