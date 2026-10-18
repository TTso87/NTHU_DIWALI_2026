// 人物展間：故事內容、收藏、複製連結，以及「想對 ○○ 說的話」留言區。

import { $, escapeHTML as e, toast } from '../lib/dom.js';
import { safeURL } from '../lib/content.js';
import { createBoard, formatDate, HONEYPOT_FIELD } from '../comments/board.js';
import { state, progress, persist } from './state.js';

function mediaVideo(url) {
  const u = safeURL(url);
  if (!u)
    return '<div class="video-placeholder"><p>訪談影片，等待入展。<br><small>可在「策展內容編輯」加入 YouTube 網址或 MP4 影片。</small></p></div>';
  const parsed = new URL(u);
  let vid = '';
  if (['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(parsed.hostname))
    vid = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
  if (parsed.hostname === 'youtu.be') vid = parsed.pathname.slice(1);
  if (/^[\w-]{11}$/.test(vid))
    return `<iframe src="https://www.youtube-nocookie.com/embed/${vid}" title="人物訪談影片" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
  return `<video controls preload="metadata" src="${e(u)}">你的瀏覽器無法播放此影片。</video>`;
}

function gallery(photos) {
  if (!photos.length) return '';
  const figures = photos
    .filter(p => safeURL(p.url, { image: true }))
    .map(
      p =>
        `<figure><img src="${e(safeURL(p.url, { image: true }))}" alt="${e(p.caption)}" loading="lazy"><figcaption>${e(p.caption)}</figcaption></figure>`,
    )
    .join('');
  return `<div class="story-gallery">${figures}</div>`;
}

function commentsSection(s) {
  return `<section class="story-comments">
    <h3>想對 ${e(s.name)} 說的話</h3>
    <div id="story-comment-list"></div>
    <form id="story-comment-form">
      <label>暱稱<input name="name" maxlength="24" required></label>
      <label>留言<textarea name="message" maxlength="300" rows="3" required placeholder="這段故事讓我想到……"></textarea></label>
      ${HONEYPOT_FIELD}
      <p class="storage-note">留言會立即公開，請勿留下電話、地址等個人資料。看到不當留言可按「檢舉」。</p>
      <button class="button gold" type="submit">留下回應</button>
    </form>
  </section>`;
}

const saveLabel = id => (progress.saved.includes(id) ? '已收藏 · 取消收藏' : '收藏這個故事');

export function openStory(id) {
  const { stories } = state.content;
  const s = stories.find(s => s.id === id);
  if (!s) return;
  if (!progress.visited.includes(id)) {
    progress.visited.push(id);
    persist();
  }
  const cover = safeURL(s.cover, { image: true });
  const audio = safeURL(s.audio);
  $('#story-content').innerHTML = `
    <div class="story-head">
      <p class="eyebrow">${e(s.cityEn)} / ${e(s.city)}</p>
      ${s.demo ? '<span class="badge">虛構人物 · 版型示例</span>' : ''}
      <h2>${e(s.name)} 的家鄉記憶</h2>
      <p class="story-meta">${e(s.theme)} · ${e(s.intro)}</p>
      <blockquote>「${e(s.quote)}」</blockquote>
      <div class="story-actions"><button class="button" id="save-story">${saveLabel(id)}</button><button class="button" id="copy-story">複製故事連結</button></div>
    </div>
    <div class="story-body">
      ${cover ? `<img class="story-hero-image" src="${e(cover)}" alt="${e(s.name)}提供的故事照片">` : ''}
      ${mediaVideo(s.video)}
      ${audio ? `<p>聽他說</p><audio controls preload="none" src="${e(audio)}"></audio>` : ''}
      <h3>我家的排燈節</h3><p>${e(s.body)}</p>
      <h3>打開記憶的抽屜</h3>
      <div class="memory-items">${s.memories.map(m => `<details><summary>${e(m.title)}</summary><p>${e(m.text)}</p></details>`).join('')}</div>
      <h3>離家以後</h3><p>${e(s.taiwan)}</p>
      ${gallery(s.photos)}
      ${commentsSection(s)}
      <div class="story-actions"><button class="button" id="next-story">走進下一個故事</button></div>
    </div>`;
  $('#story-dialog').showModal();
  $('#story-dialog').scrollTop = 0;
  history.replaceState(null, '', location.pathname + location.search + '#story/' + encodeURIComponent(id));

  $('#save-story').onclick = () => {
    const i = progress.saved.indexOf(id);
    if (i < 0) progress.saved.push(id);
    else progress.saved.splice(i, 1);
    persist();
    $('#save-story').textContent = saveLabel(id);
  };
  $('#copy-story').onclick = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      toast('已複製這個故事的連結');
    } catch {
      toast('請從瀏覽器網址列複製連結');
    }
  };
  $('#next-story').onclick = () => openStory(stories[(stories.indexOf(s) + 1) % stories.length].id);

  createBoard({
    thread: 'story:' + id,
    listEl: $('#story-comment-list'),
    formEl: $('#story-comment-form'),
    emptyHTML: `<p class="empty-state">還沒有人留言，寫下第一句給 ${e(s.name)} 的話吧。</p>`,
    renderItem: (m, report) =>
      `<article><small>${e(m.name)}${m.created_at ? ' · ' + e(formatDate(m.created_at)) : ''}</small><p>${e(m.message)}</p>${report}</article>`,
  });
}
