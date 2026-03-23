import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { GameComponent } from './features/game/game.component';
import { RankingComponent } from './features/ranking/ranking.component';
import { ComoJogarComponent } from './features/como-jogar/como-jogar.component';
import { DifficultySelectorComponent } from './features/difficulty-selector/difficulty-selector.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-senha', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'como-jogar', component: ComoJogarComponent, canActivate: [authGuard] },
  { path: 'difficulty', component: DifficultySelectorComponent, canActivate: [authGuard] },
  { path: 'game', component: GameComponent, canActivate: [authGuard] },
  { path: 'game/:gameCode', component: GameComponent, canActivate: [authGuard] },
  { path: 'ranking', component: RankingComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' },
];
