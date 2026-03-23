import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-como-jogar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="painel-como-jogar">
      <header class="modal-header">
        <h2>Como Jogar</h2>
        <p>Descubra a combinação secreta em até 10 tentativas.</p>
      </header>

      <section class="instructions">
        <div class="instruction-step">
          <p>A cada tentativa, o sistema informa quantas cores estão na <strong>posição correta</strong>.</p>
        </div>

        <div class="example-row" aria-label="Exemplo: uma posição correta">
          <div class="peg-row">
            <span class="peg red"></span>
            <span class="peg blue"></span>
            <span class="peg green"></span>
            <span class="peg yellow"></span>
          </div>
          <div class="dots" aria-hidden="true">
            <span class="dot filled"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
        <p class="sub-text">Tem uma posição correta.</p>

        <hr class="divider" />

        <div class="instruction-step">
          <p>
            No modo <strong>Fácil</strong>, as cores não se repetem. Nos demais, a repetição é permitida.
          </p>
        </div>

        <div class="example-row" aria-label="Exemplo: nenhuma posição correta">
          <div class="peg-row">
            <span class="peg purple"></span>
            <span class="peg purple"></span>
            <span class="peg orange"></span>
            <span class="peg orange"></span>
          </div>
          <div class="dots" aria-hidden="true">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
        <p class="sub-text">Nenhuma posição correta.</p>
      </section>

      <footer class="modal-footer">
        <p>Uma nova combinação é gerada a cada partida!</p>
        <a routerLink="/difficulty" class="btn-primary">Entendi!</a>
      </footer>
    </div>
  `,
  styles: [`
    .painel-como-jogar {
      --bg-modal: #1e2128;
      --text-main: #ffffff;
      --text-dim: #a0a0a0;
      --accent: #f7a823;
      --border: #33363f;

      background-color: var(--bg-modal);
      color: var(--text-main);
      padding: 24px;
      border-radius: 16px;
      max-width: 450px;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0 auto;
    }

    .modal-header h2 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .modal-header p {
      color: var(--text-dim);
      margin: 0 0 24px 0;
      line-height: 1.4;
    }

    .instruction-step p {
      font-size: 0.95rem;
      line-height: 1.4;
      margin-bottom: 12px;
    }

    .example-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.9rem;
      margin: 16px 0 8px 0;
      padding: 0.85rem 0.9rem;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .peg-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .peg {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: inline-block;
      border: 2px solid rgba(255, 255, 255, 0.1);
    }

    .red { background: #ff4d4d; }
    .blue { background: #4d94ff; }
    .green { background: #4dff88; }
    .yellow { background: #ffeb3b; }
    .purple { background: #9c27b0; }
    .orange { background: #ff9800; }

    .dots {
      width: 56px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
      flex-shrink: 0;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
    }
    .dot.filled {
      background: rgba(248, 250, 252, 0.95);
    }

    .sub-text {
      font-size: 0.85rem;
      color: var(--text-dim);
      margin-bottom: 20px;
      line-height: 1.4;
    }

    .divider {
      border: 0;
      border-top: 1px solid var(--border);
      margin: 20px 0;
    }

    .modal-footer {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .modal-footer p {
      margin: 0 0 16px 0;
      color: var(--text-dim);
      font-size: 0.85rem;
    }

    .btn-primary {
      width: 100%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 14px;
      border-radius: 8px;
      border: none;
      background-color: var(--accent);
      color: #000;
      font-weight: bold;
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }
  `],
})
export class ComoJogarComponent {}
