import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  animations: [
    trigger('fadeDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-12px)' }),
        animate('240ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('gridEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('260ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="shell">
      <div class="shell-content">
        <div class="shell-head" @fadeDown>
          <h1 class="shell-title">
            Olá,
            <span class="shell-accent">{{ authService.currentUser()?.username ?? 'Jogador' }}!</span>
          </h1>
          <p class="shell-sub">Selecione um módulo para iniciar</p>
        </div>

        <div class="shell-grid" @gridEnter>
          <a routerLink="/como-jogar" class="shell-item">
            <div class="glow"></div>
            <div class="shell-card">
              <div class="shell-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v2.5"></path>
                  <path d="M11.9 13h.2v3h-.2z"></path>
                </svg>
              </div>
              <h2>Como Jogar</h2>
              <p>Veja as regras e dicas antes de começar</p>
            </div>
          </a>

          <a routerLink="/difficulty" class="shell-item">
            <div class="glow"></div>
            <div class="shell-card">
              <div class="shell-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              </div>
              <h2>Novo Jogo</h2>
              <p>Iniciar uma nova partida de Mastermind</p>
            </div>
          </a>

          <a routerLink="/ranking" class="shell-item">
            <div class="glow"></div>
            <div class="shell-card">
              <div class="shell-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 21h8"></path>
                  <path d="M12 17V3"></path>
                  <path d="M7 7h10"></path>
                  <path d="M7 11h10"></path>
                </svg>
              </div>
              <h2>Ranking</h2>
              <p>Ver melhores pontuações</p>
            </div>
          </a>
        </div>

        @if (authService.currentUser(); as u) {
          <p
            class="shell-best"
            [class.shell-best--pending]="u.streakDays > 0 && !u.streakWonToday"
            @fadeDown
          >
            @if (u.streakDays > 0 && u.streakWonToday) {
              🔥 Sequência: <strong>{{ u.streakDays }}</strong>
              {{ u.streakDays === 1 ? 'dia' : 'dias' }} seguidos — vitória registrada hoje
            } @else if (u.streakDays > 0 && !u.streakWonToday) {
              🔥 <strong>Hoje ainda falta:</strong> ganhe uma partida em qualquer nível para
              <strong>não perder</strong> os {{ u.streakDays }} {{ u.streakDays === 1 ? 'dia' : 'dias' }} de sequência.
            } @else {
              🔥 Ganhe uma partida hoje para começar a contar dias seguidos
            }
          </p>
        }

        <button type="button" class="shell-logout" (click)="logout()">
          Sair
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      width: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }

    .shell {
      position: relative;
      flex: 1;
      min-height: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: clamp(0.75rem, 3vmin, 2rem) max(1.25rem, env(safe-area-inset-left, 0px));
      box-sizing: border-box;
      overflow: hidden;
      background: transparent;
    }

    .shell-content {
      position: relative;
      z-index: 1;
      width: min(100%, 980px);
      max-width: 980px;
      flex: 0 1 auto;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      min-height: 0;
      overflow: visible;
    }
    .shell-head,
    .shell-grid,
    .shell-best {
      width: 100%;
      max-width: 100%;
    }
    .shell-head { text-align: center; margin-bottom: clamp(1rem, 3vmin, 2.5rem); }
    .shell-title { margin: 0 0 0.5rem 0; font-size: clamp(1.5rem, 4.5vmin, 2.25rem); font-weight: 800; color: rgba(248,250,252,0.95); }
    .shell-accent { color: #f59e0b; }
    .shell-sub {
      margin: 0;
      font-size: 0.72rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: rgba(148,163,184,0.75);
    }

    .shell-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(0.75rem, 2.5vmin, 1.75rem);
      align-items: stretch;
      width: 100%;
      justify-items: stretch;
    }
    @media (max-width: 820px) {
      .shell-grid { grid-template-columns: 1fr; }
    }
    @media (max-height: 720px) {
      .shell-card { padding: 1.25rem 1.1rem !important; }
      .shell-card h2 { font-size: 1.25rem !important; }
      .shell-icon { width: 44px !important; height: 44px !important; }
      .shell-best { margin-top: 1rem !important; }
      .shell-logout { margin-top: 1.25rem !important; }
    }

    .shell-item { position: relative; display: block; text-decoration: none; color: inherit; }
    .glow {
      position: absolute; inset: -6px;
      border-radius: 28px;
      background: linear-gradient(90deg, rgba(245,158,11,0.75), rgba(234,88,12,0.75));
      filter: blur(18px);
      opacity: 0.18;
      transition: opacity 280ms ease, transform 280ms ease;
      transform: translateY(0);
    }
    .shell-card {
      position: relative;
      height: 100%;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.10);
      backdrop-filter: blur(18px);
      border-radius: 28px;
      padding: clamp(1.25rem, 3vmin, 2.1rem) clamp(1.1rem, 2.5vmin, 2rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.75rem;
      transition: transform 240ms ease, border-color 240ms ease;
      box-shadow: 0 22px 55px rgba(0,0,0,0.45);
    }
    .shell-item:hover .glow { opacity: 0.55; transform: translateY(-6px); }
    .shell-item:hover .shell-card { transform: translateY(-10px) scale(1.02); border-color: rgba(245,158,11,0.30); }

    .shell-icon {
      width: 56px; height: 56px;
      border-radius: 18px;
      display: grid; place-items: center;
      color: #f59e0b;
      background: rgba(245,158,11,0.10);
      border: 1px solid rgba(255,255,255,0.08);
      transition: background 240ms ease, color 240ms ease, transform 240ms ease;
      margin-bottom: 0.25rem;
    }
    .shell-item:hover .shell-icon { background: #f59e0b; color: #050a14; transform: scale(1.02); }

    .shell-card h2 { margin: 0; font-size: 1.6rem; font-weight: 800; color: rgba(248,250,252,0.95); }
    .shell-card p { margin: 0; font-size: 0.95rem; line-height: 1.45; color: rgba(148,163,184,0.85); max-width: 38ch; }

    .shell-best { margin: 2rem 0 0; text-align: center; color: rgba(245,158,11,0.95); font-weight: 700; max-width: 52ch; margin-left: auto; margin-right: auto; line-height: 1.45; }
    .shell-best--pending { color: rgba(251, 191, 36, 0.98); }
    .shell-logout {
      align-self: center;
      width: auto;
      max-width: 100%;
      margin: 2.5rem auto 0;
      padding: 0 0.5rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.72rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: rgba(148,163,184,0.7);
      transition: color 160ms ease;
    }
    .shell-logout:hover { color: rgba(239,68,68,0.95); }
  `],
})
export class DashboardComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.refreshProfile().subscribe({ error: () => {} });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
