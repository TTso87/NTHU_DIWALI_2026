// 故事尋光（觀展任務進度）

import { $ } from '../lib/dom.js';
import { openActivity } from '../app/dialogs.js';
import { state, progress, complete } from '../app/state.js';

export function huntGame() {
  const { stories } = state.content;
  const visited = progress.visited.filter(id => stories.some(s => s.id === id));
  const themes = new Set(stories.filter(s => visited.includes(s.id)).map(s => s.theme));
  const tasks = [
    { label: '走進三個人物展間', value: Math.min(3, visited.length), max: 3 },
    { label: '探索兩種故事主題', value: Math.min(2, themes.size), max: 2 },
    { label: '收藏一個喜歡的故事', value: Math.min(1, progress.saved.length), max: 1 },
  ];
  const done = tasks.every(t => t.value === t.max);
  if (done) complete('hunt');
  openActivity(
    `<p class="eyebrow">A JOURNEY THROUGH STORIES</p><h2>下一盞光，會在哪裡？</h2><p>回到地圖，自由探索。每次打開故事，都會在這個裝置留下旅程足跡。</p><ul class="hunt-list">${tasks.map(t => `<li>${t.value === t.max ? '✦' : '○'} ${t.label}<span>${t.value} / ${t.max}</span></li>`).join('')}</ul><p class="game-status">${done ? '你已完成這段尋光旅程。還有更多故事，等你慢慢發現。' : '完成任務後，回到這裡看看你的進度。'}</p><button id="hunt-explore" class="button gold">回地圖探索</button>`,
  );
  $('#hunt-explore').onclick = () => {
    $('#activity-dialog').close();
    location.hash = 'map';
  };
}
