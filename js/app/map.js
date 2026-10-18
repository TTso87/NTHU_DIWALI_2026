// 01 家鄉故事地圖：地圖底圖、城市光點、右側人物清單、縮放。

import { $, $$, escapeHTML as e } from '../lib/dom.js';
import { safeURL } from '../lib/content.js';
import { state } from './state.js';
import { openStory } from './stories.js';

const HOME_CENTER = [360, 340];
let mapZoom = 1;
let mapCenter = [...HOME_CENTER];
let selected = '';

// 經緯度 → SVG 座標
const project = ([lon, lat]) => [(lon - 66) * 21, (37 - lat) * 21];

const visibleStories = () => {
  const filter = $('#theme-filter').value;
  return state.content.stories.filter(s => filter === 'all' || s.theme === filter);
};

function updateView() {
  const w = 720 / mapZoom;
  const h = 680 / mapZoom;
  $('#india-map').setAttribute('viewBox', `${mapCenter[0] - w / 2} ${mapCenter[1] - h / 2} ${w} ${h}`);
}

function resetView() {
  mapZoom = 1;
  mapCenter = [...HOME_CENTER];
  updateView();
}

export function drawMap(geo) {
  const paths = [];
  for (const f of geo.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    let d = '';
    for (const poly of polys) {
      for (const ring of poly) {
        d +=
          ring
            .map((p, i) => {
              const [x, y] = project(p);
              return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join('') + 'Z';
      }
    }
    const india = f.properties.name === 'India';
    paths.push(
      `<path d="${d}" fill="${india ? '#304052' : '#1b2737'}" stroke="${india ? '#8190a0' : '#354152'}" stroke-width="${india ? '1' : '0.6'}"/>`,
    );
  }
  $('#map-geography').innerHTML = paths.join('');
  drawMarkers();
}

export function drawMarkers() {
  $('#map-markers').innerHTML = visibleStories()
    .map(s => {
      const [x, y] = project(s.coordinates);
      return `<g class="map-marker ${s.id === selected ? 'active' : ''}" transform="translate(${x},${y})" role="button" tabindex="0" aria-label="${e(s.city)}：${e(s.name)}的故事" data-story="${e(s.id)}"><circle class="pulse" r="18"/><circle class="core" r="5"/><text x="13" y="-13">${e(s.city)}</text></g>`;
    })
    .join('');
  $$('.map-marker').forEach(m => {
    m.onclick = () => selectStory(m.dataset.story, true);
    m.onkeydown = ev => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        m.click();
      }
    };
  });
}

function portrait(s) {
  const src = s.portrait && safeURL(s.portrait, { image: true });
  return src ? `<img src="${e(src)}" alt="${e(s.name)}" loading="lazy">` : e(s.name.slice(0, 1));
}

export function renderStories() {
  const stories = visibleStories();
  $('#map-count').textContent = stories.length + ' 個故事入口';
  $('#story-list').innerHTML = stories
    .map(
      s =>
        `<button class="story-card ${s.id === selected ? 'active' : ''}" data-id="${e(s.id)}"><span class="portrait-letter">${portrait(s)}</span><span><small>${e(s.cityEn)} · ${e(s.city)}</small><strong>${e(s.name)}</strong><p>${e(s.quote)}</p></span><span class="card-open">＋</span></button>`,
    )
    .join('');
  $$('.story-card').forEach(b => (b.onclick = () => selectStory(b.dataset.id, false)));
}

// 選一個故事：從地圖點選時先平滑放大到該城市，再開啟展間
function selectStory(id, zoom) {
  selected = id;
  const s = state.content.stories.find(s => s.id === id);
  drawMarkers();
  renderStories();
  if (!zoom || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    openStory(id);
    return;
  }
  const startCenter = [...mapCenter];
  const startZoom = mapZoom;
  const endCenter = project(s.coordinates);
  const start = performance.now();
  const animate = now => {
    const t = Math.min(1, (now - start) / 480);
    const ease = 1 - Math.pow(1 - t, 3);
    mapCenter = startCenter.map((v, i) => v + (endCenter[i] - v) * ease);
    mapZoom = startZoom + (1.5 - startZoom) * ease;
    updateView();
    if (t < 1) requestAnimationFrame(animate);
    else openStory(id);
  };
  requestAnimationFrame(animate);
}

export function initMap() {
  const themes = [...new Set(state.content.stories.map(s => s.theme))];
  $('#theme-filter').innerHTML += themes.map(t => `<option value="${e(t)}">${e(t)}</option>`).join('');
  renderStories();
  $('#theme-filter').onchange = () => {
    resetView();
    renderStories();
    drawMarkers();
  };
  $('#map-in').onclick = () => {
    mapZoom = Math.min(2.5, mapZoom + 0.3);
    updateView();
  };
  $('#map-out').onclick = () => {
    mapZoom = Math.max(1, mapZoom - 0.3);
    updateView();
  };
  $('#map-reset').onclick = resetView;
}
