// 與 Supabase 溝通的唯一出口。直接使用 REST API（PostgREST），不需額外套件。
// 前端只能：讀取公開留言、呼叫 submit_message、呼叫 report_message。
// 其他權限都被資料庫擋下，見 supabase/schema.sql。

import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../config.js';

export const commentsEnabled = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

const baseURL = SUPABASE_URL.replace(/\/+$/, '');

export class CommentError extends Error {
  constructor(code, status = 0) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(baseURL + path, {
      method,
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new CommentError('network');
  }
  if (!response.ok) {
    let detail = {};
    try {
      detail = await response.json();
    } catch {}
    throw new CommentError(detail.message || 'http_' + response.status, response.status);
  }
  return response.status === 204 ? null : response.json();
}

export function listMessages(thread) {
  const query = new URLSearchParams({
    select: 'id,topic,name,message,created_at',
    thread: 'eq.' + thread,
    order: 'created_at.desc',
    limit: '100',
  });
  return request('/rest/v1/messages?' + query);
}

export function submitMessage({ thread, topic = null, name, message, website = '' }) {
  return request('/rest/v1/rpc/submit_message', {
    method: 'POST',
    body: { p_thread: thread, p_topic: topic, p_name: name, p_message: message, p_website: website },
  });
}

export function reportMessage({ id, reason, detail = '' }) {
  return request('/rest/v1/rpc/report_message', {
    method: 'POST',
    body: { p_message_id: id, p_reason: reason, p_detail: detail },
  });
}

// 資料庫函式丟出的錯誤代碼 → 給訪客看的訊息
const ERROR_TEXT = {
  network: '連線失敗，請檢查網路後再試一次。',
  rate_limited: '你留言得有點快，休息幾分鐘再試吧。',
  busy: '現在留言的人很多，請稍後再試。',
  invalid_name: '暱稱需為 1–24 個字。',
  invalid_message: '留言需為 1–300 個字。',
  invalid_topic: '請選擇留言主題。',
  invalid_thread: '找不到這個留言區。',
  invalid_reason: '請選擇檢舉原因。',
  invalid_detail: '補充說明最多 200 個字。',
  not_found: '這則留言已不存在。',
};

export function errorText(error) {
  return ERROR_TEXT[error?.code] || '暫時無法完成，請稍後再試。';
}
