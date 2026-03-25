import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GameStartResponse {
  gameCode: string;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface AttemptResponse {
  correctCount: number;
  won: boolean;
  gameOver: boolean;
  attemptNumber: number;
}

export interface GameStatusResponse {
  gameCode: string;
  status: string;
  difficulty: Difficulty;
  codeLength: number;
  repetitionsAllowed: boolean;
  allowedColors: string[];
  attemptCount: number;
  finalScore: number | null;
  durationSeconds: number | null;
  startedAtEpochMs: number | null;
  attemptsMatrix: string[][];
  feedbackCounts?: number[];
  answer?: string[];
}

export interface RankingEntry {
  position: number;
  username: string;
  bestScore: number | null;
  bestScoreAt?: number | null;
  bestDurationSeconds?: number | null;
}

export interface DifficultyInfo {
  difficulty: string;
  title: string;
  description: string;
  codeLength: number;
  allowedColors: string[];
  repetitionsAllowed: boolean;
  maxAttempts: number;
}

export interface InstrucoesJogoPayload {
  steps: string[];
  difficulties: DifficultyInfo[];
}

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private http: HttpClient) {}

  startGame(difficulty: Difficulty = 'MEDIUM'): Observable<GameStartResponse> {
    return this.http.post<GameStartResponse>(
      `${environment.apiUrl}/games/start/${difficulty}`,
      {}
    );
  }

  submitAttempt(gameCode: string, guess: string[]): Observable<AttemptResponse> {
    return this.http.post<AttemptResponse>(
      `${environment.apiUrl}/games/${gameCode}/attempt`,
      { guess },
    );
  }

  getGameStatus(gameCode: string): Observable<GameStatusResponse> {
    return this.http.get<GameStatusResponse>(`${environment.apiUrl}/games/${gameCode}`);
  }

  getRanking(difficulty: Difficulty): Observable<RankingEntry[]> {
    return this.http.get<RankingEntry[]>(
      `${environment.apiUrl}/games/ranking?difficulty=${difficulty}`
    );
  }

  obterInstrucoesJogo(): Observable<InstrucoesJogoPayload> {
    return this.http.get<InstrucoesJogoPayload>(`${environment.apiUrl}/games/instrucoes`);
  }

  getDifficulties(): Observable<DifficultyInfo[]> {
    return this.http.get<DifficultyInfo[]>(`${environment.apiUrl}/games/difficulties`);
  }

  forfeitGame(gameCode: string): Observable<GameStatusResponse> {
    return this.http.post<GameStatusResponse>(
      `${environment.apiUrl}/games/${gameCode}/forfeit`,
      {}
    );
  }
}
