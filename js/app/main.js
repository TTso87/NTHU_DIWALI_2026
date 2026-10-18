// 展覽首頁進入點：載入內容後，依序啟動各區塊。

import { $, escapeHTML as e } from '../lib/dom.js';
import { loadContent, loadJSON, safeURL, showLoadError, MAP_PATH } from '../lib/content.js';
import { state, persist } from './state.js';
import { initDialogs, openActivity } from './dialogs.js';
import { initMap, drawMap, drawMarkers } from './map.js';
import { openStory } from './stories.js';
import { renderCulture } from './culture.js';
import { renderGames } from '../games/index.js';
import { initWall } from './wall.js';
import { showCollection } from './collection.js';
import { registerExhibitTools } from './webmcp.js';

function applySiteText(site) {
  document.title = site.title + '｜Light Across Home';
  if (site.title !== '離家以後，我們一起點燈') $('h1').textContent = site.title;
  $('.hero-intro').textContent = site.intro;
  $('.hero-intro').style.whiteSpace = 'pre-line';
  const hero = safeURL(site.heroImage, { image: true });
  if (hero)
    $('.hero-image').style.backgroundImage =
      `linear-gradient(90deg,#10121cf0 0%,#10121ca6 37%,#10121c10 70%),linear-gradient(0deg,#10121c 0%,transparent 25%),url(${JSON.stringify(hero)})`;
  const eventText = $('.interlude p:not(.eyebrow)');
  eventText.textContent = site.eventText;
  eventText.style.whiteSpace = 'pre-line';
  if (new URLSearchParams(location.search).get('preview') === '1')
    $('.demo-note').textContent = '策展草稿預覽 · 此版本僅在你的瀏覽器顯示';
  else if (!state.content.stories.some(s => s.demo))
    $('.demo-note').textContent = '以個人經驗為核心，由受訪者與共同策展者一起編輯。';
}

function showAbout() {
  openActivity(
    `<p class="eyebrow">ABOUT THE EXHIBITION</p><h2>從一個人的故事開始。</h2><p style="white-space:pre-line">${e(state.content.site.about)}</p><p>地圖資料：<a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener noreferrer">Natural Earth · 公有領域地理資料</a>。地圖呈現採資料來源的邊界，僅用於家鄉定位。</p><p>收藏、創作與遊戲進度只儲存在你自己的瀏覽器；清除網站資料後會移除。留言會公開顯示給所有觀眾，如發現不當內容，請按留言旁的「檢舉」，管理員會收到通知並處理。</p>`,
  );
}

// 網址為 #story/<id> 時直接打開該人物展間（方便分享故事連結）
function openStoryFromHash() {
  if (location.hash.startsWith('#story/')) openStory(decodeURIComponent(location.hash.slice(7)));
}

async function loadMap() {
  try {
    const geo = await loadJSON(MAP_PATH);
    if (geo?.type !== 'FeatureCollection' || !Array.isArray(geo.features) || !geo.features.length)
      throw Error('map.json 格式不正確，請使用網站原附的地圖資料。');
    drawMap(geo);
  } catch (err) {
    drawMarkers();
    showLoadError(err, '地圖底圖載入未完成；仍可從人物清單閱讀故事');
  }
}

async function init() {
  initDialogs();
  try {
    state.content = await loadContent();
  } catch (err) {
    showLoadError(err);
    return;
  }
  applySiteText(state.content.site);
  initMap();
  renderCulture();
  renderGames();
  initWall();
  persist();
  $('#collection-button').onclick = showCollection;
  $('#about-button').onclick = showAbout;
  window.addEventListener('hashchange', openStoryFromHash);
  openStoryFromHash();
  registerExhibitTools();
  await loadMap();
}

init();
