// 記憶翻翻卡：翻開兩張找相同的記憶物件，共 6 組。

export default {
  id: 'memory',
  icon: '▧',
  card: {
    zh: { tag: 'FIND THE PAIRS', title: '記憶翻翻卡', text: '翻開卡片，找到六組故事裡的記憶物件。', action: '翻開記憶 · 約 2 分鐘' },
    en: { tag: 'FIND THE PAIRS', title: 'Memory Pairs', text: 'Flip the cards to find six pairs of objects from the stories.', action: 'Flip cards · about 2 min' },
  },
  strings: {
    zh: {
      items: '燈,食譜,合照,信,行李,餐桌',
      title: '把散落的記憶，慢慢找回。',
      intro: '每次翻開兩張，找到相同的物件。這些物件也是你可以在採訪時使用的故事入口。',
      cardHidden: '第 {index} 張，未翻開',
      hidden: '未翻開的卡片',
      status: '已找到 {matches} / 6 組 · 翻牌 {moves} 次',
      allFound: ' · 所有記憶都找回來了！',
      again: '重新開始',
    },
    en: {
      items: 'Lamp,Recipe,Photo,Letter,Suitcase,Table',
      title: 'Gather the scattered memories, one by one.',
      intro: 'Flip two cards at a time to find matching objects. Each one can also open a conversation in an interview.',
      cardHidden: 'Card {index}, face down',
      hidden: 'Face-down card',
      status: 'Found {matches} / 6 pairs · {moves} moves',
      allFound: ' · Every memory is back!',
      again: 'Play again',
    },
  },
  styles: true,

  mount(root, ctx) {
    const { t } = ctx;
    const items = t('items').split(',');
    const cards = items.flatMap((label, id) => [
      { label, id },
      { label, id },
    ]);
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    root.innerHTML = `
      <p class="eyebrow">FIND THE PAIRS</p><h2>${t('title')}</h2><p>${t('intro')}</p>
      <div class="memory-board">${cards.map((c, i) => `<button class="memory-tile" data-card="${i}" aria-label="${t('cardHidden', { index: i + 1 })}">✦</button>`).join('')}</div>
      <p class="game-status" data-role="status"></p>
      <button data-role="again">${t('again')}</button>`;

    let first = null;
    let locked = false;
    let matches = 0;
    let moves = 0;
    let timer;
    const status = root.querySelector('[data-role="status"]');
    const update = () => (status.textContent = t('status', { matches, moves }) + (matches === 6 ? t('allFound') : ''));
    update();

    root.querySelectorAll('[data-card]').forEach(
      b =>
        (b.onclick = () => {
          if (locked || b === first || b.classList.contains('matched')) return;
          const c = cards[+b.dataset.card];
          b.textContent = c.label;
          b.setAttribute('aria-label', c.label);
          b.classList.add('revealed');
          if (!first) {
            first = b;
            return;
          }
          moves++;
          if (cards[+first.dataset.card].id === c.id) {
            [first, b].forEach(tile => {
              tile.classList.add('matched');
              tile.disabled = true;
            });
            first = null;
            matches++;
            if (matches === 6) ctx.complete();
          } else {
            locked = true;
            const prev = first;
            timer = setTimeout(() => {
              [prev, b].forEach(tile => {
                tile.textContent = '✦';
                tile.classList.remove('revealed');
                tile.setAttribute('aria-label', t('hidden'));
              });
              first = null;
              locked = false;
            }, 850);
          }
          update();
        }),
    );
    root.querySelector('[data-role="again"]').onclick = ctx.restart;
    return () => clearTimeout(timer);
  },
};
