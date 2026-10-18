// 03 互動工坊：遊戲清單與卡片。新增遊戲時，在 GAMES 加一筆並 import 對應檔案即可。

import { $, $$ } from '../lib/dom.js';
import { rangoliGame } from './rangoli.js';
import { memoryGame } from './memory.js';
import { quizGame } from './quiz.js';
import { rhythmGame } from './rhythm.js';
import { huntGame } from './hunt.js';
import { postcardGame } from './postcard.js';

const GAMES = [
  { id: 'rangoli', start: rangoliGame, icon: '✳', name: 'Rangoli 創作', en: 'COLOR & CREATE', text: '選一種顏色，畫出屬於你的對稱圖案。', action: '開始創作 · 可下載作品' },
  { id: 'memory', start: memoryGame, icon: '▧', name: '記憶翻翻卡', en: 'FIND THE PAIRS', text: '翻開卡片，找到六組故事裡的記憶物件。', action: '翻開記憶 · 約 2 分鐘' },
  { id: 'quiz', start: quizGame, icon: '?', name: '文化好奇心', en: 'A LITTLE CURIOSITY', text: '從三個小問題，練習用好奇心靠近彼此。', action: '開始探索 · 3 道題目' },
  { id: 'rhythm', start: rhythmGame, icon: '♫', name: '光的節奏', en: 'FOLLOW THE LIGHT', text: '記住亮起的順序，回應一段光與聲音。', action: '挑戰記憶 · 5 個關卡' },
  { id: 'hunt', start: huntGame, icon: '⌖', name: '故事尋光', en: 'A JOURNEY THROUGH STORIES', text: '探訪不同家鄉，留下一段自己的觀展路線。', action: '出發尋光 · 3 個任務' },
  { id: 'postcard', start: postcardGame, icon: '✧', name: '一封光的明信片', en: 'A NOTE TO SOMEONE', text: '寫給想念的人，把一點溫暖帶走。', action: '寫張明信片 · 可下載' },
];

export function renderGames() {
  $('#game-grid').innerHTML = GAMES.map(
    g =>
      `<button class="game-card" data-game="${g.id}"><div class="game-art"><span aria-hidden="true">${g.icon}</span></div><div class="game-copy"><span class="game-meta">${g.en}</span><h3>${g.name}</h3><p>${g.text}</p><span class="game-action">${g.action} ＋</span></div></button>`,
  ).join('');
  $$('[data-game]').forEach(b => (b.onclick = () => GAMES.find(g => g.id === b.dataset.game).start()));
}
