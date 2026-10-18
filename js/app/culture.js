// 02 文化探索卡片。

import { $, $$, escapeHTML as e } from '../lib/dom.js';
import { safeURL } from '../lib/content.js';
import { state } from './state.js';
import { openActivity } from './dialogs.js';

export function renderCulture() {
  const { culture } = state.content;
  $('#culture-grid').innerHTML = culture
    .map(
      (c, i) =>
        `<article class="culture-card"><span class="number">0${i + 1} /</span><h3>${e(c.title)}</h3><p>${e(c.subtitle)}</p><button data-culture="${e(c.id)}">展開這段故事 ＋</button></article>`,
    )
    .join('');
  $$('[data-culture]').forEach(
    b =>
      (b.onclick = () => {
        const c = culture.find(c => c.id === b.dataset.culture);
        const source = safeURL(c.source);
        openActivity(
          `<p class="eyebrow">CULTURE NOTES</p><h2>${e(c.title)}</h2><p style="white-space:pre-line">${e(c.body)}</p>${source ? `<p><a href="${e(source)}" target="_blank" rel="noopener noreferrer">${e(c.sourceLabel)}</a></p>` : ''}<p class="storage-note">文化內容示範 · 正式上線前請由共同策展者審閱。</p>`,
        );
      }),
  );
}
