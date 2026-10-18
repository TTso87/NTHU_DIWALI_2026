// 光的節奏（記憶亮燈順序）

import { $, $$ } from '../lib/dom.js';
import { openActivity, setActivityCleanup } from '../app/dialogs.js';
import { complete } from '../app/state.js';

const NOTES = [261.63, 329.63, 392, 523.25];

export function rhythmGame() {
  openActivity(
    '<p class="eyebrow">FOLLOW THE LIGHT</p><h2>聽見光的節奏。</h2><p>按開始後，記住光點亮起的順序，再依序點選。共五關。聲音為合成遊戲音效，不是印度傳統音樂；靜音也可以玩。</p><div class="activity-toolbar"><button id="rhythm-start" class="gold">開始挑戰</button><label><input id="rhythm-mute" type="checkbox" style="width:auto">靜音</label></div><div class="sound-pads">' +
      ['①', '②', '③', '④']
        .map((x, i) => `<button data-pad="${i}" aria-label="光點 ${i + 1}" disabled>${x}</button>`)
        .join('') +
      '</div><p class="game-status" id="rhythm-status">準備好，跟著光一起記憶。</p>',
  );
  let ctx = null;
  let sequence = [];
  let input = 0;
  let level = 0;
  let playing = false;
  let alive = true;
  const timers = [];
  const later = (fn, ms) => {
    timers.push(
      setTimeout(() => {
        if (alive) fn();
      }, ms),
    );
  };
  const beep = n => {
    try {
      ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = NOTES[n];
      o.type = 'sine';
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.13, ctx.currentTime + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.35);
    } catch {}
  };
  const light = n => {
    const b = $(`[data-pad="${n}"]`);
    if (!b) return;
    b.classList.add('lit');
    later(() => b.classList.remove('lit'), 360);
    if (!$('#rhythm-mute').checked) beep(n);
  };
  const setPads = value => $$('[data-pad]').forEach(b => (b.disabled = value));
  const round = () => {
    level++;
    input = 0;
    sequence.push(Math.floor(Math.random() * 4));
    playing = true;
    setPads(true);
    $('#rhythm-status').textContent = `第 ${level} / 5 關 · 看仔細……`;
    sequence.forEach((n, i) => later(() => light(n), i * 650 + 450));
    later(
      () => {
        playing = false;
        setPads(false);
        $('#rhythm-status').textContent = `第 ${level} / 5 關 · 換你了！`;
      },
      sequence.length * 650 + 450,
    );
  };
  $('#rhythm-start').onclick = () => {
    sequence = [];
    level = 0;
    $('#rhythm-start').disabled = true;
    round();
  };
  $$('[data-pad]').forEach(
    b =>
      (b.onclick = () => {
        if (playing) return;
        const n = +b.dataset.pad;
        light(n);
        if (sequence[input] !== n) {
          $('#rhythm-status').textContent = `停在第 ${level} 關。再試一次，慢慢來。`;
          setPads(true);
          $('#rhythm-start').disabled = false;
          $('#rhythm-start').textContent = '再試一次';
          return;
        }
        input++;
        if (input === sequence.length) {
          playing = true;
          setPads(true);
          if (level === 5) {
            $('#rhythm-status').textContent = '五關完成！你記住了整段光的節奏。';
            complete('rhythm');
            $('#rhythm-start').disabled = false;
            $('#rhythm-start').textContent = '再玩一次';
          } else later(round, 750);
        }
      }),
  );
  setActivityCleanup(() => {
    alive = false;
    timers.forEach(clearTimeout);
    ctx?.close();
  });
}
