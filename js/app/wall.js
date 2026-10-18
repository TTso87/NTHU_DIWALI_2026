// 04 點燈留言牆（首頁）。

import { $, $$, escapeHTML as e } from '../lib/dom.js';
import { createBoard, formatDate } from '../comments/board.js';
import { state } from './state.js';

let wallTopic = 'all';

function setTopic(topic) {
  wallTopic = topic;
  $$('[data-wall]').forEach(b => b.classList.toggle('active', b.dataset.wall === topic));
}

export function initWall() {
  const board = createBoard({
    thread: 'wall',
    listEl: $('#messages'),
    formEl: $('#message-form'),
    samples: state.content.messages.map(m => ({ ...m, sample: true })),
    filter: m => wallTopic === 'all' || m.topic === wallTopic,
    emptyHTML: '<p class="empty-state">這裡還沒有留言，留下第一盞燈吧。</p>',
    renderItem: (m, report) =>
      `<article class="message"><span class="spark" aria-hidden="true">✦</span><small> ${e(m.topic)}</small><p>${e(m.message)}</p><small>${e(m.name)}${m.sample ? ' · 示例' : m.created_at ? ' · ' + e(formatDate(m.created_at)) : ''}</small>${report}</article>`,
    onSubmitted: () => setTopic('all'),
  });
  $$('[data-wall]').forEach(
    b =>
      (b.onclick = () => {
        setTopic(b.dataset.wall);
        board.draw();
      }),
  );
}
