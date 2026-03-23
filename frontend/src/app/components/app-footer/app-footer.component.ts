import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-left">
          <div class="footer-brand-row">
            <span class="footer-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="7" y="7" width="10" height="10" rx="2" />
                <path d="M3 9h4M3 15h4M17 9h4M17 15h4M9 3v4M15 3v4M9 17v4M15 17v4" />
              </svg>
            </span>
            <span class="footer-brand-tag">Mastermind</span>
            <span class="footer-copyright">2026</span>
          </div>
        </div>

        <div class="footer-right">
          <a
            class="footer-github"
            href="https://github.com/zmattheusz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="footer-github-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 0C5.37 0 0 5.38 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.205.086 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.335-5.466-5.93 0-1.31.465-2.382 1.235-3.22-.123-.304-.535-1.527.116-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.013-.405c1.02.005 2.045.138 3.013.405 2.292-1.552 3.298-1.23 3.298-1.23.652 1.65.24 2.872.118 3.176.77.838 1.234 1.91 1.234 3.22 0 4.607-2.804 5.624-5.475 5.921.43.37.814 1.1.814 2.222 0 1.606-.015 2.897-.015 3.289 0 .32.216.693.825.576C20.565 21.796 24 17.3 24 12c0-6.62-5.373-12-12-12z"
                />
              </svg>
            </span>
            <span class="footer-github-text">GitHub: /zmattheusz</span>
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 40;
      height: var(--footer-height, 72px);
      width: 100%;
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.35);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
    }

    .footer-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.25rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .footer-brand-row {
      display: flex;
      align-items: center;
      gap: 0.55rem;
    }

    .footer-icon {
      color: #f59e0b;
      display: inline-flex;
      transform: translateY(0.5px);
    }

    .footer-brand-tag {
      font-size: 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: rgba(148, 163, 184, 0.75);
      text-transform: uppercase;
      letter-spacing: 0.3em;
      white-space: nowrap;
    }

    .footer-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .footer-github {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.42rem 0.9rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.10);
      background: rgba(255, 255, 255, 0.05);
      color: rgba(226, 232, 240, 0.95);
      text-decoration: none;
      transition: transform 180ms ease, background 180ms ease, border-color 180ms ease, color 180ms ease;
    }

    .footer-github:hover {
      transform: translateY(-2px) scale(1.05);
      border-color: rgba(245, 158, 11, 0.55);
      background: rgba(245, 158, 11, 0.06);
      color: rgba(255, 255, 255, 0.98);
    }

    .footer-github:active {
      transform: translateY(0) scale(0.98);
    }

    .footer-github-icon {
      color: rgba(248, 250, 252, 0.9);
      display: inline-flex;
    }

    .footer-github-text {
      font-size: 10px;
      font-weight: 800;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .footer-copyright {
      display: inline-flex;
      font-size: 9px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      color: rgba(148, 163, 184, 0.8);
      letter-spacing: 0.25em;
    }

    .footer-github:hover .footer-github-icon { color: #f59e0b; }
  `],
})
export class AppFooterComponent {}
