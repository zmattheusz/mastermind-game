import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { GameComponent } from './game.component';
import { GameService } from '../../core/services/game.service';
import { AuthService } from '../../core/services/auth.service';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameService: jasmine.SpyObj<GameService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    gameService = jasmine.createSpyObj('GameService', ['startGame', 'submitAttempt', 'getGameStatus']);
    authService = jasmine.createSpyObj('AuthService', ['refreshProfile']);
    authService.refreshProfile.and.returnValue(of({} as any));
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        { provide: GameService, useValue: gameService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 10 rows', () => {
    expect(component.rows().length).toBe(10);
  });

  it('nextColor should cycle colors', () => {
    expect(component.nextColor(null, 0)).toBe('R');
    expect(component.nextColor('R', 0)).toBe('G');
    expect(component.nextColor('P', 0)).toBe('R');
  });
});
