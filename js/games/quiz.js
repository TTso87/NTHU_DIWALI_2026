// 文化好奇心問答（題目來自 data/content.json 的 quiz）

import { $, $$, escapeHTML as e } from '../lib/dom.js';
import { openActivity } from '../app/dialogs.js';
import { state, complete } from '../app/state.js';

export function quizGame() {
  const { quiz } = state.content;
  let index = 0;
  let score = 0;
  const render = () => {
    if (index >= quiz.length) {
      complete('quiz');
      openActivity(
        `<p class="eyebrow">CURIOSITY COMPLETED</p><h2>帶著好奇，繼續認識彼此。</h2><p>你答對了 ${score} / ${quiz.length} 題。每一個故事，都值得多問一句、多聽一點。</p><button class="button gold" id="quiz-again">再玩一次</button>`,
      );
      $('#quiz-again').onclick = quizGame;
      return;
    }
    const q = quiz[index];
    openActivity(
      `<p class="eyebrow">A LITTLE CURIOSITY · ${index + 1} / ${quiz.length}</p><h2>${e(q.question)}</h2><div class="question-options">${q.options.map((o, i) => `<button data-answer="${i}">${e(o)}</button>`).join('')}</div><p class="game-status" id="quiz-feedback"></p><button id="quiz-next" class="button gold" hidden>下一題</button>`,
    );
    $$('[data-answer]').forEach(
      b =>
        (b.onclick = () => {
          const correct = +b.dataset.answer === q.answer;
          if (correct) score++;
          $$('[data-answer]').forEach(o => {
            o.disabled = true;
            if (+o.dataset.answer === q.answer) o.classList.add('correct');
          });
          if (!correct) b.classList.add('wrong');
          $('#quiz-feedback').textContent = (correct ? '答對了。' : '換個角度想想。') + q.explanation;
          $('#quiz-next').hidden = false;
        }),
    );
    $('#quiz-next').onclick = () => {
      index++;
      render();
    };
  };
  render();
}
