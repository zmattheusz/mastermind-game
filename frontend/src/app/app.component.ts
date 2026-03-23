import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AppFooterComponent],
  template: `
    <div class="app-layout" [class.app-layout--authed]="authService.isLoggedIn()">
      @if (authService.isLoggedIn()) {
        <div class="app-shell-bg" aria-hidden="true">
          <div class="app-shell-bg-inner">
            <div class="app-noise"></div>
            <div class="app-orb app-orb-1"></div>
            <div class="app-orb app-orb-2"></div>
          </div>
        </div>

        <nav class="nav">
          <div class="nav-inner">
            <a routerLink="/dashboard" class="brand" aria-label="Ir para início">
              <span class="pulse" aria-hidden="true"></span>
              <span class="brand-text">MASTER<span class="brand-accent">MIND</span></span>
            </a>

            <div class="links">
              <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="link">
                Início
                <span class="underline" aria-hidden="true"></span>
              </a>
              <a routerLink="/difficulty" routerLinkActive="active" class="link">
                Novo jogo
                <span class="underline" aria-hidden="true"></span>
              </a>
              <a routerLink="/ranking" routerLinkActive="active" class="link">
                Ranking
                <span class="underline" aria-hidden="true"></span>
              </a>
            </div>

            <button type="button" class="logout" (click)="logout()">
              Sair do Sistema
            </button>
          </div>
        </nav>
      }
      <main>
        <router-outlet></router-outlet>
      </main>
      @if (showFooter) {
        <app-footer></app-footer>
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      width: 100%;
    }

    .app-layout {
      flex: 1;
      min-height: 0;
      min-height: 100dvh;
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 100%;
      position: relative;
      background: var(--bg-primary, #050a14);
      --footer-height: 72px;
    }

    .app-layout--authed {
      background: transparent;
    }

    main {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 100%;
      position: relative;
      z-index: 1;
      padding: 0;
      padding-top: 92px;
      padding-bottom: calc(1rem + var(--footer-height));
      background: transparent;
    }

    .app-layout--authed main {
      background: transparent;
    }
    main > *:not(router-outlet) {
      flex: 1 1 auto;
      min-height: 0;
      width: 100%;
    }

    .nav {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 50;
      padding: 1rem 1.25rem;
      pointer-events: none;
    }
    .nav-inner {
      pointer-events: auto;
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1.25rem;
      border-radius: 18px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.10);
      backdrop-filter: blur(18px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.40);
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      user-select: none;
    }
    .pulse {
      width: 8px;
      height: 26px;
      border-radius: 999px;
      background: #f59e0b;
      opacity: 0.95;
      animation: beat 1.5s ease-in-out infinite;
    }
    @keyframes beat {
      0%, 100% { transform: scaleY(1); opacity: 0.85; }
      50% { transform: scaleY(1.18); opacity: 1; }
    }
    .brand-text {
      font-size: 1.05rem;
      font-weight: 900;
      letter-spacing: -0.04em;
      color: rgba(248,250,252,0.95);
    }
    .brand-accent { color: #f59e0b; }

    .links {
      display: none;
      align-items: center;
      gap: 2rem;
    }
    @media (min-width: 860px) {
      .links { display: flex; }
    }
    .link {
      position: relative;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: rgba(148,163,184,0.85);
      text-decoration: none;
      transition: color 160ms ease;
    }
    .link:hover { color: rgba(248,250,252,0.95); }
    .underline {
      position: absolute;
      left: 0;
      bottom: -6px;
      height: 1px;
      width: 0;
      background: #f59e0b;
      transition: width 180ms ease;
    }
    .link:hover .underline { width: 100%; }
    .link.active { color: rgba(248,250,252,0.96); }
    .link.active .underline { width: 100%; }

    .logout {
      padding: 0.55rem 0.9rem;
      border-radius: 12px;
      border: 1px solid rgba(239,68,68,0.30);
      background: transparent;
      color: rgba(239,68,68,0.95);
      font-size: 0.62rem;
      font-weight: 900;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      cursor: pointer;
      transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
      white-space: nowrap;
    }
    .logout:hover {
      transform: scale(1.03);
      background: rgba(239,68,68,0.10);
      border-color: rgba(239,68,68,0.55);
    }
    .logout:active { transform: scale(0.98); }
  `],
})
export class AppComponent {
  showFooter = true;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {
    this.updateFooterVisibility();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.updateFooterVisibility());
  }

  private updateFooterVisibility(): void {
    const path = this.router.url.split('?')[0];
    this.showFooter = !path.startsWith('/login') && !path.startsWith('/recuperar-senha');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
