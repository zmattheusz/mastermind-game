import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { GameService, RankingEntry, Difficulty } from '../../core/services/game.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(14px)' }),
        animate('260ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="rank-shell">
      <div class="rank-head" @fadeUp>
        <button type="button" class="back" (click)="goBack()">
          <span aria-hidden="true">‹</span> Voltar
        </button>

        <div class="title">
          <h1>Ranking por Modo</h1>
          <p>Top Decoders</p>
        </div>

      <div class="tabs" role="tablist" aria-label="Ranking por dificuldade">
        <button type="button" role="tab" class="tab" [class.active]="selectedDifficulty === 'EASY'" (click)="selectDifficulty('EASY')">Fácil</button>
        <button type="button" role="tab" class="tab" [class.active]="selectedDifficulty === 'MEDIUM'" (click)="selectDifficulty('MEDIUM')">Médio</button>
        <button type="button" role="tab" class="tab" [class.active]="selectedDifficulty === 'HARD'" (click)="selectDifficulty('HARD')">Difícil</button>
      </div>

        <div class="spacer" aria-hidden="true"></div>
      </div>

      @if (loading) {
        <p class="loading">Carregando...</p>
      } @else if (error) {
        <p class="error-message">{{ error }}</p>
      } @else {
        <div class="table-card" @fadeUp>
          <table class="rank-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Usuário</th>
                <th>Tentativas</th>
                <th>Tempo</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              @for (entry of ranking; track entry.position) {
                <tr [class.first]="entry.position === 1">
                  <td class="pos">
                    @if (entry.position === 1) {
                      <span class="medal">🏅 01</span>
                    } @else {
                      <span class="mono">{{ entry.position < 10 ? ('0' + entry.position) : entry.position }}</span>
                    }
                  </td>
                  <td class="user">{{ entry.username }}</td>
                  <td>
                    <span class="pill" [class.pill-first]="entry.position === 1">
                      {{ entry.bestScore != null ? (entry.bestScore + ' tentativas') : '-' }}
                    </span>
                  </td>
                  <td class="mono tempo">{{ formatDuration(entry.bestDurationSeconds ?? null) }}</td>
                  <td class="date">{{ formatBestScoreAt(entry.bestScoreAt ?? null) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="stats" @fadeUp>
          <div class="stat">
            <p>Total de jogadores</p>
            <div class="value">{{ ranking.length }}</div>
          </div>
          <div class="stat">
            <p>Média de tentativas</p>
            <div class="value">{{ avgAttempts }}</div>
          </div>
          <div class="stat">
            <p>Sua posição</p>
            <div class="value">{{ yourPositionLabel }}</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .rank-shell {
      min-height: calc(100vh - 92px - 1rem - var(--footer-height));
      padding: 2rem 1.25rem 2.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .rank-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .tabs {
      display: flex;
      gap: 0.6rem;
      justify-content: center;
      flex-wrap: wrap;
      margin: -1.1rem 0 1.8rem 0;
      width: 100%;
    }

    .tab {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(226,232,240,0.92);
      border-radius: 999px;
      padding: 0.55rem 0.95rem;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
    }

    .tab:hover {
      transform: translateY(-2px);
      border-color: rgba(255,255,255,0.20);
    }

    .tab.active {
      background: rgba(245,158,11,0.14);
      border-color: rgba(245,158,11,0.35);
      box-shadow: 0 0 24px rgba(245,158,11,0.14);
    }

    .back {
      background: none;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(148,163,184,0.85);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      transition: color 160ms ease, transform 160ms ease;
    }
    .back:hover { color: rgba(248,250,252,0.95); transform: translateX(-2px); }
    .back span { font-size: 1.25rem; line-height: 1; opacity: 0.9; }

    .title { text-align: center; }
    .title h1 {
      margin: 0;
      font-size: 1.9rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      text-transform: uppercase;
      color: rgba(248,250,252,0.95);
    }
    .title p {
      margin: 0.5rem 0 0;
      color: #f59e0b;
      font-size: 0.62rem;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    .spacer { width: 94px; }

    .loading { color: rgba(148,163,184,0.85); }

    .table-card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 28px;
      overflow: hidden;
      backdrop-filter: blur(18px);
    }

    .rank-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    thead tr {
      background: rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.10);
    }
    th {
      padding: 1.25rem 1.5rem;
      font-size: 0.62rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: rgba(148,163,184,0.8);
      font-weight: 800;
    }
    td {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      color: rgba(248,250,252,0.9);
    }
    tbody tr:hover { background: rgba(255,255,255,0.02); }
    tbody tr.first { background: rgba(245,158,11,0.06); }

    .pos { width: 140px; }
    .medal { display: inline-flex; align-items: center; gap: 0.5rem; color: #f59e0b; font-weight: 900; }
    .mono { color: rgba(148,163,184,0.9); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    .user { font-weight: 800; letter-spacing: -0.01em; }

    .pill {
      display: inline-flex;
      padding: 0.35rem 0.65rem;
      border-radius: 999px;
      font-size: 0.62rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-weight: 900;
      background: rgba(255,255,255,0.10);
      color: rgba(203,213,225,0.95);
    }
    .pill-first { background: #f59e0b; color: #050a14; }

    .tempo { color: rgba(226,232,240,0.88); }
    .date { color: rgba(148,163,184,0.65); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

    .stats {
      margin-top: 1.5rem;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }
    @media (max-width: 900px) {
      .stats { grid-template-columns: 1fr; }
      .spacer { display: none; }
    }
    .stat {
      background: rgba(0,0,0,0.35);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 18px;
      padding: 1.25rem;
      text-align: center;
    }
    .stat p {
      margin: 0 0 0.4rem 0;
      font-size: 0.62rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: rgba(148,163,184,0.65);
    }
    .value { font-size: 1.9rem; font-weight: 900; color: rgba(248,250,252,0.95); }
  `],
})
export class RankingComponent implements OnInit {
  ranking: RankingEntry[] = [];
  loading = true;
  error = '';
  avgAttempts = '—';
  yourPositionLabel = '—';
  selectedDifficulty: Difficulty = 'MEDIUM';

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadRanking(this.selectedDifficulty);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  private computeStats(): void {
    const scored = this.ranking.map((r) => r.bestScore).filter((s): s is number => typeof s === 'number' && s > 0);
    if (scored.length) {
      const avg = scored.reduce((a, b) => a + b, 0) / scored.length;
      this.avgAttempts = avg.toFixed(1);
    } else {
      this.avgAttempts = '—';
    }

    const me = this.authService.currentUser()?.username;
    if (me) {
      const found = this.ranking.find((r) => r.username === me);
      this.yourPositionLabel = found ? `#${found.position < 10 ? '0' + found.position : found.position}` : '—';
    }
  }

  selectDifficulty(difficulty: Difficulty): void {
    if (this.selectedDifficulty === difficulty) return;
    this.selectedDifficulty = difficulty;
    this.loadRanking(difficulty);
  }

  private loadRanking(difficulty: Difficulty): void {
    this.loading = true;
    this.error = '';

    this.gameService.getRanking(difficulty).subscribe({
      next: (data) => {
        this.ranking = data;
        this.computeStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erro ao carregar ranking.';
        this.loading = false;
      },
    });
  }

  formatBestScoreAt(ms: number | null): string {
    if (!ms) return '-';
    const d = new Date(ms);
    const time = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
    const date = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
    return `${time} - ${date}`;
  }

  formatDuration(totalSeconds: number | null): string {
    if (totalSeconds == null || totalSeconds < 0) return '—';
    const t = Math.floor(totalSeconds);
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
