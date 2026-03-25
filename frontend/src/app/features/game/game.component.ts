import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService, AttemptResponse, GameStatusResponse } from '../../core/services/game.service';
import { AuthService } from '../../core/services/auth.service';

const COLOR_LABELS: Record<string, string> = {
  R: 'Vermelho',
  G: 'Verde',
  B: 'Azul',
  Y: 'Amarelo',
  O: 'Laranja',
  P: 'Roxo',
  C: 'Ciano',
  M: 'Magenta',
};

export interface RowState {
  guess: (string | null)[];
  feedback: number | null;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy {
  readonly colorLabels = COLOR_LABELS;

  gameCode = signal<string | null>(null);
  codeLength = signal(4);
  availableColors = signal<string[]>(['R', 'G', 'B', 'Y', 'O', 'P']);
  repetitionsAllowed = signal(true);

  rows = signal<RowState[]>(this.initialRowsForLength(this.codeLength()));
  currentAttempt = signal(0);
  feedbacks = signal<number[]>([]);
  status = signal<'playing' | 'won' | 'lost'>('playing');
  errorMessage = signal('');
  answer = signal<string[] | null>(null);
  loading = signal(false);
  gameOver = computed(() => this.status() !== 'playing');
  dotIndices = computed(() => Array.from({ length: this.codeLength() }, (_, i) => i + 1));

  /** Segundos decorridos na partida (servidor manda o começo; ao terminar, congela no durationSeconds). */
  elapsedSeconds = signal(0);

  secondHandTurn = computed(() => `rotate(${this.elapsedSeconds() * 6}deg)`);

  private clockId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private auth: AuthService,
  ) {}

  private initialRows(): RowState[] {
    return this.initialRowsForLength(4);
  }

  private initialRowsForLength(codeLength: number): RowState[] {
    return Array.from({ length: 10 }, () => ({
      guess: Array.from({ length: codeLength }, () => null),
      feedback: null,
    }));
  }

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('gameCode');
    if (code) {
      this.gameCode.set(code);
      this.loadGameState(code);
    } else {
      this.startNewGame();
    }
  }

  ngOnDestroy(): void {
    this.stopClock();
  }

  private startNewGame(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.gameService.startGame('MEDIUM').subscribe({
      next: (res) => {
        this.gameCode.set(res.gameCode);
        this.rows.set(this.initialRowsForLength(this.codeLength()));
        this.currentAttempt.set(0);
        this.feedbacks.set([]);
        this.status.set('playing');
        this.loading.set(false);
        this.router.navigate(['/game', res.gameCode], { replaceUrl: true });
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erro ao iniciar partida.');
        this.loading.set(false);
      },
    });
  }

  private loadGameState(code: string): void {
    this.gameService.getGameStatus(code).subscribe({
      next: (res: GameStatusResponse) => {
        this.codeLength.set(res.codeLength);
        this.repetitionsAllowed.set(res.repetitionsAllowed);
        this.availableColors.set(res.allowedColors);

        const matrix = res.attemptsMatrix || [];
        const feedbackCounts = res.feedbackCounts || [];
        const newRows = this.initialRowsForLength(res.codeLength);
        for (let i = 0; i < matrix.length; i++) {
          newRows[i].guess = [...matrix[i]];
          newRows[i].feedback = feedbackCounts[i] ?? null;
        }
        this.rows.set(newRows);
        this.currentAttempt.set(matrix.length);
        this.feedbacks.set([...feedbackCounts]);
        if (res.status === 'WON') this.status.set('won');
        else if (res.status === 'LOST') this.status.set('lost');
        this.answer.set(res.answer ?? null);
        this.syncClockFromStatus(res);
      },
      error: () => this.errorMessage.set('Partida não encontrada.'),
    });
  }

  private stopClock(): void {
    if (this.clockId != null) {
      clearInterval(this.clockId);
      this.clockId = null;
    }
  }

  private syncClockFromStatus(res: GameStatusResponse): void {
    this.stopClock();
    if (res.status === 'IN_PROGRESS' && res.startedAtEpochMs != null) {
      const startedAt = res.startedAtEpochMs;
      const tick = () => {
        const sec = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
        this.elapsedSeconds.set(sec);
      };
      tick();
      this.clockId = setInterval(tick, 250);
    } else if (res.durationSeconds != null) {
      this.elapsedSeconds.set(res.durationSeconds);
    } else {
      this.elapsedSeconds.set(0);
    }
  }

  formatClock(): string {
    const t = this.elapsedSeconds();
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  currentRow(): RowState {
    const r = this.rows();
    const idx = this.currentAttempt();
    return r[idx] ?? r[0];
  }

  setSlot(index: number, color: string): void {
    if (this.gameOver()) return;
    const idx = this.currentAttempt();
    const r = [...this.rows()];
    if (idx >= 10) return;
    r[idx] = { ...r[idx], guess: [...r[idx].guess] };
    r[idx].guess[index] = color;
    this.rows.set(r);
  }

  canSubmit(): boolean {
    const row = this.currentRow();
    return row.guess.every((c) => c != null) && !this.loading();
  }

  submitAttempt(): void {
    if (!this.canSubmit()) return;
    const code = this.gameCode();
    if (!code) return;
    const row = this.currentRow();
    const guess = row.guess as string[];

    this.loading.set(true);
    this.errorMessage.set('');
    this.gameService.submitAttempt(code, guess).subscribe({
      next: (res: AttemptResponse) => {
        const r = [...this.rows()];
        const idx = this.currentAttempt();
        r[idx] = { ...r[idx], guess: [...guess], feedback: res.correctCount };
        this.rows.set(r);
        this.feedbacks.update((f) => [...f.slice(0, idx), res.correctCount, ...f.slice(idx + 1)]);
        this.currentAttempt.set(idx + 1);
        if (res.won) this.status.set('won');
        else if (res.gameOver) this.status.set('lost');

        if (res.won) {
          this.auth.refreshProfile().subscribe({ error: () => {} });
        }

        if (res.gameOver) {
          const codeVal = this.gameCode();
          if (codeVal) {
            this.gameService.getGameStatus(codeVal).subscribe((st) => {
              this.answer.set(st.answer ?? null);
              this.syncClockFromStatus(st);
            });
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erro ao enviar tentativa.');
        this.loading.set(false);
      },
    });
  }

  forfeit(): void {
    const code = this.gameCode();
    if (!code) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.gameService.forfeitGame(code).subscribe({
      next: (res) => {
        if (res.status === 'WON') this.status.set('won');
        else this.status.set('lost');
        this.answer.set(res.answer ?? null);
        this.syncClockFromStatus(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Erro ao desistir.');
        this.loading.set(false);
      },
    });
  }

  getFeedbackForRow(index: number): number | null {
    const r = this.rows();
    if (index >= r.length) return null;
    return r[index].feedback;
  }

  nextColor(current: string | null, rowIndex: number): string {
    const colors = this.availableColors();
    if (!colors.length) return '' as string;
    if (!current) return colors[0];

    if (this.repetitionsAllowed()) {
      const idx = colors.indexOf(current);
      const nextIdx = idx >= 0 ? (idx + 1) % colors.length : 0;
      return colors[nextIdx];
    }

    const row = this.rows()[rowIndex];
    const used = new Set(row.guess.filter((c): c is string => !!c));

    let idx = colors.indexOf(current);
    if (idx < 0) idx = 0;

    for (let i = 0; i < colors.length; i++) {
      idx = (idx + 1) % colors.length;
      const candidate = colors[idx];
      if (!used.has(candidate) || candidate === current) {
        return candidate;
      }
    }
    return current;
  }

  fillNextSlot(color: string): void {
    const row = this.currentRow();
    if (!this.repetitionsAllowed() && row.guess.includes(color)) {
      return;
    }
    const emptyIndex = row.guess.findIndex((c) => c == null);
    if (emptyIndex >= 0) this.setSlot(emptyIndex, color);
  }
}
