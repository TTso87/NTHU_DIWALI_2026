// Rangoli 對稱上色創作

import { $, $$, escapeHTML as e, download, toast } from '../lib/dom.js';
import { store } from '../lib/storage.js';
import { openActivity } from '../app/dialogs.js';
import { complete } from '../app/state.js';

export function rangoliGame() {
  openActivity(
    '<p class="eyebrow">COLOR & CREATE</p><h2>一圈一圈，把心意畫出來。</h2><p>選擇顏色，點選圖形上色。同一圈會一起改變，也可以切換自由配色。這是對稱幾何創作示範；正式圖樣可由共同策展者提供。</p><div class="activity-toolbar"><label>顏色<input id="paint-color" type="color" value="#eac18c"></label><label>模式<select id="paint-mode"><option value="ring">對稱配色</option><option value="single">自由配色</option></select></label><button id="paint-reset">重設</button><button id="paint-save" class="gold">下載作品</button></div><svg id="rangoli" class="rangoli-canvas" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="可上色的對稱幾何畫布"></svg><p class="game-status" id="paint-status">用鍵盤 Tab 選擇圖形，按 Enter 也能上色。</p>',
  );
  const svg = $('#rangoli');
  const saved = store.read('rangoli', {});
  const colors = ['#c77a62', '#b99963', '#606f92', '#bea6af'];
  let html =
    '<circle cx="250" cy="250" r="244" fill="#151c2b"/><circle cx="250" cy="250" r="231" fill="none" stroke="#eac18c55"/>';
  for (let ring = 0; ring < 4; ring++) {
    const count = (ring + 1) * 8;
    const r = 40 + ring * 52;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const x = 250 + Math.cos(a) * r;
      const y = 250 + Math.sin(a) * r;
      const id = `${ring}-${i}`;
      html += `<ellipse class="tile" tabindex="0" role="button" aria-label="第 ${ring + 1} 圈，第 ${i + 1} 個圖形" data-ring="${ring}" data-tile="${id}" cx="${x}" cy="${y}" rx="${16 - ring}" ry="23" transform="rotate(${(a * 180) / Math.PI + 90} ${x} ${y})" fill="${e(saved[id] || colors[ring])}" stroke="#151c2b" stroke-width="2"/>`;
    }
  }
  html += '<circle cx="250" cy="250" r="12" fill="#eac18c"/>';
  svg.innerHTML = html;

  const paint = t => {
    const targets = $('#paint-mode').value === 'ring' ? $$(`[data-ring="${t.dataset.ring}"]`, svg) : [t];
    targets.forEach(el => {
      el.setAttribute('fill', $('#paint-color').value);
      saved[el.dataset.tile] = $('#paint-color').value;
    });
    store.write('rangoli', saved);
    complete('rangoli');
    $('#paint-status').textContent = '已保存此裝置上的創作進度。';
  };
  $$('.tile', svg).forEach(t => {
    t.onclick = () => paint(t);
    t.onkeydown = ev => {
      if (['Enter', ' '].includes(ev.key)) {
        ev.preventDefault();
        paint(t);
      }
    };
  });
  $('#paint-reset').onclick = () => {
    store.remove('rangoli');
    rangoliGame();
  };
  $('#paint-save').onclick = () => {
    const copy = svg.cloneNode(true);
    copy.setAttribute('width', '1000');
    copy.setAttribute('height', '1000');
    download('my-rangoli.svg', new XMLSerializer().serializeToString(copy), 'image/svg+xml');
    complete('rangoli');
    toast('作品已下載');
  };
}
