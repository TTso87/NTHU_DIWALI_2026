// 留言板 UI：首頁「點燈留言」與人物展間「想對 ○○ 說的話」共用。
// 負責載入留言、送出表單、檢舉。外觀由呼叫端的 renderItem 決定。

import { $, escapeHTML as e, toast } from '../lib/dom.js';
import { store } from '../lib/storage.js';
import { commentsEnabled, listMessages, submitMessage, reportMessage, errorText } from './api.js';

const REPORT_REASONS = ['不當內容', '騷擾或攻擊', '垃圾訊息', '其他'];
const reported = new Set(store.read('reported', []));

export function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

function reportControl(m) {
  if (m.sample) return '';
  return reported.has(m.id)
    ? '<span class="report-done">已檢舉</span>'
    : `<button type="button" class="report-button" data-report="${e(m.id)}" aria-label="檢舉這則留言">檢舉</button>`;
}

function reportFormHTML(id) {
  return `<form class="report-form" data-report-form="${e(id)}">
    <label>檢舉原因<select name="reason">${REPORT_REASONS.map(r => `<option>${r}</option>`).join('')}</select></label>
    <label>補充說明（選填）<input name="detail" maxlength="200" autocomplete="off"></label>
    <div class="report-actions"><button type="submit" class="gold">送出檢舉</button><button type="button" data-report-cancel>取消</button></div>
  </form>`;
}

/**
 * @param {object} options
 * @param {string} options.thread       'wall' 或 'story:<人物 ID>'
 * @param {Element} options.listEl      放留言清單的容器
 * @param {HTMLFormElement} options.formEl 留言表單
 * @param {(m: object, report: string) => string} options.renderItem 單則留言 HTML（已含檢舉按鈕字串）
 * @param {string} options.emptyHTML    沒有留言時顯示的 HTML
 * @param {object[]} [options.samples]  留言板未連線時顯示的示例留言
 * @param {(m: object) => boolean} [options.filter] 例如依主題篩選
 * @param {() => void} [options.onSubmitted]
 */
export function createBoard({ thread, listEl, formEl, renderItem, emptyHTML, samples = [], filter = () => true, onSubmitted }) {
  let items = [];
  let status = commentsEnabled ? 'loading' : 'offline';

  function draw() {
    if (status === 'loading') {
      listEl.innerHTML = '<p class="empty-state">正在點亮留言……</p>';
      return;
    }
    if (status === 'error') {
      listEl.innerHTML =
        '<p class="empty-state">留言暫時載入不了。<button type="button" class="text-button" data-retry>再試一次</button></p>';
      return;
    }
    const list = (status === 'offline' ? samples : items).filter(filter);
    listEl.innerHTML = list.length ? list.map(m => renderItem(m, reportControl(m))).join('') : emptyHTML;
  }

  async function refresh() {
    if (!commentsEnabled) return draw();
    status = 'loading';
    draw();
    try {
      items = await listMessages(thread);
      status = 'ready';
    } catch {
      status = 'error';
    }
    draw();
  }

  listEl.addEventListener('click', ev => {
    const target = ev.target.closest('button');
    if (!target) return;
    if (target.hasAttribute('data-retry')) refresh();
    if (target.dataset.report) {
      const article = target.closest('article');
      if (!article || $('.report-form', article)) return;
      article.insertAdjacentHTML('beforeend', reportFormHTML(target.dataset.report));
      $('.report-form select', article).focus();
    }
    if (target.hasAttribute('data-report-cancel')) target.closest('form').remove();
  });

  listEl.addEventListener('submit', async ev => {
    const form = ev.target.closest('[data-report-form]');
    if (!form) return;
    ev.preventDefault();
    const id = form.dataset.reportForm;
    const data = new FormData(form);
    const button = $('button[type=submit]', form);
    button.disabled = true;
    try {
      await reportMessage({ id, reason: data.get('reason'), detail: String(data.get('detail') || '').trim() });
      reported.add(id);
      store.write('reported', [...reported].slice(-200));
      toast('已通知管理員，謝謝你幫忙守護這裡。');
      draw();
    } catch (err) {
      button.disabled = false;
      toast(errorText(err));
    }
  });

  const note = $('.storage-note', formEl);
  if (!commentsEnabled) {
    for (const el of formEl.elements) el.disabled = true;
    if (note) note.textContent = '留言板尚未連線：管理者完成 Supabase 設定後即可留言。目前顯示的是示例。';
  }

  formEl.addEventListener('submit', async ev => {
    ev.preventDefault();
    if (!commentsEnabled) return;
    const data = new FormData(formEl);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !message) return;
    const button = $('button[type=submit]', formEl);
    button.disabled = true;
    try {
      const row = await submitMessage({
        thread,
        topic: data.get('topic') || null,
        name,
        message,
        website: String(data.get('website') || ''),
      });
      formEl.reset();
      if (row?.id) {
        items.unshift(row);
        status = 'ready';
      }
      onSubmitted?.();
      draw();
      toast('你的光已經點亮了 ✦');
    } catch (err) {
      toast(errorText(err));
    } finally {
      button.disabled = false;
    }
  });

  refresh();
  return { draw, refresh };
}

// 表單內的隱藏欄位：真人看不到也不會填，填了就是機器人。
export const HONEYPOT_FIELD =
  '<label class="hp-field" aria-hidden="true">請勿填寫<input name="website" tabindex="-1" autocomplete="off"></label>';
