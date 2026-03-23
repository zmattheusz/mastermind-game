import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GameService, Difficulty, DifficultyInfo } from '../../core/services/game.service';

@Component({
  selector: 'app-difficulty-selector',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="diff-shell">
      <div class="diff-header">
        <h1>
          Escolha sua
          <span>Dificuldade</span>
        </h1>
        <p>Selecione o módulo de simulação</p>
      </div>

      <div class="diff-grid">
        @for (d of difficulties(); track d.difficulty) {
          <button
            type="button"
            class="diff-card"
            [class.diff-card--EASY]="d.difficulty === 'EASY'"
            [class.diff-card--MEDIUM]="d.difficulty === 'MEDIUM'"
            [class.diff-card--HARD]="d.difficulty === 'HARD'"
            (click)="start(d.difficulty)"
            [disabled]="loading()"
          >
            <div class="card-glow"></div>

            <div class="icon-wrap">
              <span class="emoji" [class.emoji--EASY]="d.difficulty === 'EASY'" [class.emoji--MEDIUM]="d.difficulty === 'MEDIUM'" [class.emoji--HARD]="d.difficulty === 'HARD'">
                {{ d.difficulty === 'EASY' ? '⭐' : (d.difficulty === 'MEDIUM' ? '😐' : '💀') }}
              </span>
            </div>

            <div class="level">{{ d.title }}</div>
            <div class="desc">{{ d.description }}</div>

            <div class="meta">
              {{ d.codeLength }} posições • {{ d.allowedColors.length }} cores •
              {{ d.repetitionsAllowed ? 'com repetições' : 'sem repetições' }}
            </div>

            <div class="cta">
              Iniciar simulação
            </div>
          </button>
        }
      </div>

      <div class="actions">
        <a routerLink="/dashboard" class="btn btn-secondary">Voltar ao início</a>
      </div>
    </div>
  `,
  styles: [`
    .diff-shell {
      min-height: calc(100vh - 92px - 1rem - var(--footer-height));
      padding: 2.25rem 1.25rem;
      display: grid;
      place-items: center;
      gap: 1.25rem;
    }

    .diff-header {
      width: 100%;
      max-width: 980px;
      text-align: center;
      margin-bottom: 0.5rem;
    }

    h1 {
      margin: 0;
      font-size: 2.1rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: rgba(248,250,252,0.96);
    }

    h1 span {
      display: inline-block;
      background: linear-gradient(90deg, #fb923c, #f97316);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      filter: drop-shadow(0 0 16px rgba(255,157,0,0.35));
    }

    .diff-header p {
      margin: 0.5rem 0 0;
      font-size: 0.75rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(148,163,184,0.7);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    .diff-grid {
      width: 100%;
      max-width: 980px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    @media (min-width: 860px) {
      .diff-grid { grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
    }

    .diff-card {
      position: relative;
      cursor: pointer;
      text-align: center;
      padding: 1.35rem 1.15rem 1.1rem;
      border-radius: 26px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.10);
      backdrop-filter: blur(14px);
      box-shadow: 0 18px 45px rgba(0,0,0,0.45);
      overflow: hidden;
      transform: translateY(0);
      transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
      color: rgba(248,250,252,0.96);
    }

    .diff-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.07);
    }

    .diff-card:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .card-glow {
      position: absolute;
      inset: -2px;
      opacity: 0.0;
      transition: opacity 220ms ease;
      filter: blur(10px);
      background: radial-gradient(circle at 30% 10%, rgba(255,255,255,0.30), transparent 55%);
      pointer-events: none;
    }

    .diff-card:hover .card-glow { opacity: 1; }

    .diff-card--EASY .card-glow {
      background: linear-gradient(135deg, rgba(34,197,94,0.55), rgba(16,185,129,0.10));
    }
    .diff-card--MEDIUM .card-glow {
      background: linear-gradient(135deg, rgba(234,179,8,0.55), rgba(245,158,11,0.10));
    }
    .diff-card--HARD .card-glow {
      background: linear-gradient(135deg, rgba(239,68,68,0.55), rgba(153,27,27,0.10));
    }

    .icon-wrap {
      width: 100%;
      display: grid;
      place-items: center;
      margin-bottom: 0.9rem;
    }

    .emoji {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: rgba(255,255,255,0.06);
      box-shadow: 0 0 30px rgba(0,0,0,0.35);
      font-size: 34px;
      line-height: 1;
      transform: translateZ(0);
      user-select: none;
    }

    .diff-card--EASY .emoji { text-shadow: 0 0 22px rgba(74,222,128,0.35); }
    .diff-card--MEDIUM .emoji { text-shadow: 0 0 22px rgba(250,204,21,0.35); }
    .diff-card--HARD .emoji { text-shadow: 0 0 26px rgba(239,68,68,0.55); }

    .emoji--EASY {}
    .emoji--MEDIUM {}
    .emoji--HARD {}

    .level {
      font-size: 1.65rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
    }

    .desc {
      color: rgba(148,163,184,0.90);
      font-size: 0.95rem;
      line-height: 1.4;
      margin: 0 0 1rem 0;
      min-height: 3.0em;
    }

    .meta {
      color: rgba(226,232,240,0.84);
      font-size: 0.82rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }

    .cta {
      display: inline-block;
      padding: 0.55rem 0.95rem;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.18);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      transition: box-shadow 180ms ease, border-color 180ms ease;
    }

    .diff-card--EASY .cta { border-color: rgba(74,222,128,0.35); box-shadow: 0 0 22px rgba(74,222,128,0.12); }
    .diff-card--MEDIUM .cta { border-color: rgba(250,204,21,0.35); box-shadow: 0 0 22px rgba(250,204,21,0.10); }
    .diff-card--HARD .cta { border-color: rgba(248,113,113,0.35); box-shadow: 0 0 22px rgba(248,113,113,0.10); }

    .actions {
      width: 100%;
      max-width: 980px;
      display: flex;
      justify-content: center;
      margin-top: 0.2rem;
    }
  `],
})
export class DifficultySelectorComponent implements OnInit {
  difficulties = signal<DifficultyInfo[]>([]);
  loading = signal(false);

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.gameService.getDifficulties().subscribe({
      next: (res) =>
        this.difficulties.set((res ?? []).map((d) => ({
          ...d,
          allowedColors: d.allowedColors ?? [],
        }))),
      error: () => this.difficulties.set([]),
      complete: () => this.loading.set(false),
    });
  }

  start(difficulty: string): void {
    this.loading.set(true);
    this.gameService.startGame(difficulty as Difficulty).subscribe({
      next: (res) => {
        this.router.navigate(['/game', res.gameCode], { replaceUrl: true });
      },
      error: () => this.loading.set(false),
    });
  }
}

