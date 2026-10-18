// 記憶翻翻卡

import { $, $$ } from '../lib/dom.js';
import { openActivity, setActivityCleanup } from '../app/dialogs.js';
import { complete } from '../app/state.js';

export function memoryGame() {
  const items = ['燈', '食譜', '合照', '信', '行李', '餐桌'];
  const cards = items.flatMap((label, id) => [
    { label, id },
    { label, id },
  ]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  openActivity(
    '<p class="eyebrow">FIND THE PAIRS</p><h2>把散落的記憶，慢慢找回。</h2><p>每次翻開兩張，找到相同的物件。這些物件也是你可以在採訪時使用的故事入口。</p><div class="memory-board">' +
      cards
        .map((c, i) => `<button class="memory-tile" data-card="${i}" aria-label="第 ${i + 1} 張，未翻開">✦</button>`)
        .join('') +
      '</div><p class="game-status" id="memory-status">已找到 0 / 6 組 · 翻牌 0 次</p><button id="memory-again">重新開始</button>',
  );
  let first = null;
  let locked = false;
  let matches = 0;
  let moves = 0;
  let timer;
  const update = () =>
    ($('#memory-status').textContent =
      `已找到 ${matches} / 6 組 · 翻牌 ${moves} 次${matches === 6 ? ' · 所有記憶都找回來了！' : ''}`);
  $$('[data-card]').forEach(
    b =>
      (b.onclick = () => {
        if (locked || b === first || b.classList.contains('matched')) return;
        const c = cards[+b.dataset.card];
        b.textContent = c.label;
        b.setAttribute('aria-label', c.label);
        b.classList.add('revealed');
        if (!first) {
          first = b;
          return;
        }
        moves++;
        if (cards[+first.dataset.card].id === c.id) {
          [first, b].forEach(t => {
            t.classList.add('matched');
            t.disabled = true;
          });
          first = null;
          matches++;
          if (matches === 6) complete('memory');
          update();
        } else {
          locked = true;
          const prev = first;
          timer = setTimeout(() => {
            [prev, b].forEach(t => {
              t.textContent = '✦';
              t.classList.remove('revealed');
              t.setAttribute('aria-label', '未翻開的卡片');
            });
            first = null;
            locked = false;
          }, 850);
          update();
        }
      }),
  );
  setActivityCleanup(() => clearTimeout(timer));
  $('#memory-again').onclick = memoryGame;
}
