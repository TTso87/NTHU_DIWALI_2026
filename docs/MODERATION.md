# 留言管理（刪除、隱藏、查看檢舉）

留言送出後會立即公開。收到「【留言檢舉】」通知信，或自己看到不當留言時，照下面處理。

## 方法一：用表格介面（最簡單）

1. 登入 <https://supabase.com/dashboard>，進入專案。
2. 左側 **Table Editor** → 選 **`messages`**。
3. 找到要處理的留言（可以用上方 Filter 依 `id` 或 `name` 篩選；通知信裡有留言的 `id`）。
4. 擇一：
   - **刪除**：勾選那一列 → **Delete**。相關檢舉紀錄會一起刪除。
   - **隱藏**（保留紀錄、日後可恢復）：把 `hidden` 改成 `true` → Save。

網站重新整理後就看不到了。

## 方法二：用 SQL

左側 **SQL Editor** → New query，貼上後 Run：

```sql
-- 刪除一則留言（id 從通知信複製）
delete from public.messages where id = '貼上留言 id';

-- 隱藏 / 恢復
update public.messages set hidden = true  where id = '貼上留言 id';
update public.messages set hidden = false where id = '貼上留言 id';

-- 看最近的檢舉，以及每則被檢舉幾次
select m.id, m.name, m.message, m.hidden, count(r.id) as 檢舉次數, max(r.created_at) as 最近檢舉
from public.reports r join public.messages m on m.id = r.message_id
group by m.id
order by 最近檢舉 desc;

-- 看最新 50 則留言（包含已隱藏）
select id, thread, topic, name, message, hidden, created_at
from public.messages order by created_at desc limit 50;

-- 被洗版時：刪除最近 30 分鐘內、同一個來源送出的所有留言
-- （先用上一段查出可疑留言的 id，填進下面）
delete from public.messages
where author_hash = (select author_hash from public.messages where id = '可疑留言 id')
  and created_at > now() - interval '30 minutes';
```

## 緊急關閉留言板

把 `js/config.js` 的兩個值改回空字串 `''` 並 push。網站會顯示示例留言、表單停用；資料庫裡的留言不受影響，改回來就恢復。

## 欄位說明（`messages` 表）

| 欄位 | 意思 |
|---|---|
| `thread` | `wall` = 首頁留言牆；`story:jaipur-memory` = Aarav 的展間（冒號後是人物 ID） |
| `topic` | 首頁留言的主題（祝福／家的記憶／提問）；人物展間留言為空 |
| `name`、`message` | 暱稱、內容 |
| `hidden` | `true` 時網站不顯示 |
| `author_hash` | 留言來源的雜湊，用來限制頻率，無法反推出 IP |

> 注意：人物 ID（在策展編輯頁可改）是留言對應的依據。如果改了某位人物的 ID，舊留言不會跟著過去。
