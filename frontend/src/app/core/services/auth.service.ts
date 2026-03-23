import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  bestScore: number;
  streakDays: number;
  lastStreakDate: string | null;
  streakWonToday: boolean;
}

export interface LoginResponse {
  token: string;
  type: string;
  user: UserResponse;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'mm_token';
  private readonly userKey = 'mm_user';

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userSignal = signal<UserResponse | null>(this.getStoredUser());

  currentUser = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(usernameOrEmail: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { usernameOrEmail, password })
      .pipe(
        tap((res) => {
          const u = this.normalizeUser(res.user);
          this.tokenSignal.set(res.token);
          this.userSignal.set(u);
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify(u));
        }),
      );
  }

  register(
    username: string,
    email: string,
    password: string,
    securityAnswer: string,
  ): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/auth/register`, {
      username,
      email,
      password,
      securityAnswer,
    });
  }

  resetPassword(email: string, securityAnswer: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/reset-password`, {
      email,
      securityAnswer,
      newPassword,
    });
  }

  refreshProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${environment.apiUrl}/auth/me`).pipe(
      tap((user) => {
        const u = this.normalizeUser(user);
        this.userSignal.set(u);
        localStorage.setItem(this.userKey, JSON.stringify(u));
      }),
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  private normalizeUser(user: UserResponse): UserResponse {
    return {
      ...user,
      streakDays: user.streakDays ?? 0,
      lastStreakDate: user.lastStreakDate ?? null,
      streakWonToday: user.streakWonToday ?? false,
    };
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getStoredUser(): UserResponse | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return this.normalizeUser(JSON.parse(raw) as UserResponse);
    } catch {
      return null;
    }
  }
}
