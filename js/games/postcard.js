// 一封光的明信片（產生 PNG 下載）

import { $, download } from '../lib/dom.js';
import { openActivity } from '../app/dialogs.js';
import { complete } from '../app/state.js';

function drawPostcard() {
  const c = document.createElement('canvas');
  c.width = 1400;
  c.height = 900;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(1000, 850, 30, 700, 500, 1000);
  g.addColorStop(0, '#76503b');
  g.addColorStop(1, '#151c2c');
  x.fillStyle = g;
  x.fillRect(0, 0, 1400, 900);
  x.strokeStyle = '#c5a477';
  x.lineWidth = 2;
  x.strokeRect(45, 45, 1310, 810);
  x.textAlign = 'center';
  x.fillStyle = '#eac18c';
  x.font = '23px sans-serif';
  x.fillText('LIGHT ACROSS HOME', 700, 140);
  x.font = '42px serif';
  x.fillText($('#post-to').value, 700, 250, 1150);
  x.fillStyle = '#f2e8dc';
  x.font = '34px serif';
  // 逐字換行，避免超出明信片寬度
  const lines = [];
  for (const para of $('#post-message').value.split('\n')) {
    let line = '';
    for (const ch of para) {
      if (x.measureText(line + ch).width > 1080) {
        lines.push(line);
        line = ch;
      } else line += ch;
    }
    lines.push(line);
  }
  const start = 400 - Math.max(0, lines.length - 2) * 20;
  lines.forEach((line, i) => x.fillText(line, 700, start + i * 55));
  x.font = '24px sans-serif';
  x.fillStyle = '#d9c7b0';
  x.fillText($('#post-from').value, 700, 730, 1100);
  x.font = '18px sans-serif';
  x.fillText('離家以後，我們一起點燈。', 700, 800);
  return c;
}

export function postcardGame() {
  openActivity(
    '<p class="eyebrow">A NOTE TO SOMEONE</p><h2>把一點光，寄給想念的人。</h2><label>想寫給誰<input id="post-to" maxlength="30" placeholder="給遠方的你" value="給遠方的你"></label><label>你的心意<textarea id="post-message" maxlength="120" rows="3">願我們相隔再遠，也總有一起點燈的時刻。</textarea></label><label>署名<input id="post-from" maxlength="25" placeholder="你的名字"></label><div class="postcard-preview"><p class="eyebrow">LIGHT ACROSS HOME</p><h3 id="post-title"></h3><p id="post-copy"></p><small id="post-sender"></small></div><button id="post-download" class="button gold">下載明信片 PNG</button>',
  );
  const update = () => {
    $('#post-title').textContent = $('#post-to').value;
    $('#post-copy').textContent = $('#post-message').value;
    $('#post-sender').textContent = $('#post-from').value;
  };
  ['post-to', 'post-message', 'post-from'].forEach(id => ($('#' + id).oninput = update));
  update();
  $('#post-download').onclick = () =>
    drawPostcard().toBlob(blob => {
      download('a-little-light.png', blob, 'image/png');
      complete('postcard');
    });
}
