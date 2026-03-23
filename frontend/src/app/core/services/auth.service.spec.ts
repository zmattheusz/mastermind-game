import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: router }],
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be logged in initially', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should set token and user after login', () => {
    const user = {
      id: 1,
      username: 'test',
      email: 't@t.com',
      bestScore: 0,
      streakDays: 0,
      lastStreakDate: null,
      streakWonToday: false,
    };
    (service as any).tokenSignal.set('fake-jwt');
    (service as any).userSignal.set(user);
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getToken()).toBe('fake-jwt');
  });

  it('logout should clear token and user', () => {
    (service as any).tokenSignal.set('x');
    (service as any).userSignal.set({} as any);
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getToken()).toBeNull();
  });
});
