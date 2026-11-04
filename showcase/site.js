const samples = [
  {
    text: 'Mưa vừa dứt, con đường nhỏ còn giữ lại mùi đất ẩm.',
    translation: '雨刚停，小路上还留着湿润泥土的气息。',
    tags: 'Tả cảnh · Nhịp chậm',
    tagsZh: '写景 · 舒缓',
  },
  {
    text: 'Đèn cửa sổ vẫn sáng, dù người khách cuối cùng đã rời đi.',
    translation: '最后一位客人已经离开，窗边的灯却还亮着。',
    tags: 'Tương phản · Dư âm',
    tagsZh: '对照 · 余韵',
  },
  {
    text: 'Cô gấp lá thư lại, như thể có thể gấp cả nỗi lo vào trong.',
    translation: '她把信折起来，仿佛连忧虑也能一起折进去。',
    tags: 'So sánh · Nội tâm',
    tagsZh: '比喻 · 内心',
  },
];

const byId = (id) => document.getElementById(id);
const buttons = document.querySelectorAll('[data-code]');
const segments = document.querySelectorAll('.progress-track i');
const labels = { '1': ['Giữ', '通过'], '2': ['Từ chối', '拒绝'], '3': ['Xem sau', '稍后'] };
const decisions = [];
let committed = false;

function feedback(text, translation) {
  const chinese = document.createElement('span');
  chinese.lang = 'zh-Hans';
  chinese.textContent = translation;
  byId('feedback').replaceChildren(text, chinese);
}

function render() {
  const count = decisions.length;
  const total = samples.length;
  const sample = samples[count];
  byId('progress').textContent = sample
    ? `Mục ${count + 1} / ${total} · 第 ${count + 1} 项`
    : `Đã xem ${total} / ${total} · 已查看全部`;
  byId('review-status').textContent = committed
    ? 'Đã lưu lô · 已保存'
    : sample ? 'Chờ duyệt · 待审核' : 'Chờ lưu lô · 等待保存';
  segments.forEach((segment, index) => {
    segment.classList.toggle('is-done', index < count);
    segment.classList.toggle('is-current', index === count);
  });
  buttons.forEach((button) => { button.disabled = !sample; });
  byId('commit').disabled = Boolean(sample) || committed;
  byId('sample-id').textContent = sample ? `MẪU 0${count + 1} / 示例 0${count + 1}` : 'LÔ MINH HỌA / 演示批次';
  byId('sample-text').textContent = sample?.text ?? 'Đã xem hết các mục.';
  byId('sample-translation').textContent = sample?.translation ?? '所有条目均已查看。';
  byId('sample-tags').textContent = sample?.tags ?? '';
  byId('sample-tags-zh').textContent = sample?.tagsZh ?? '';
}

function choose(code) {
  if (decisions.length === samples.length) return;
  const [label, labelZh] = labels[code];
  decisions.push(code);
  feedback(`Đã chọn: ${label}. Chưa lưu lô.`, `已选择：${labelZh}。尚未保存。`);
  render();
  if (decisions.length === samples.length) byId('commit').focus();
}

buttons.forEach((button) => button.addEventListener('click', () => choose(button.dataset.code)));
byId('demo').addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  if (Object.hasOwn(labels, event.key)) choose(event.key);
});

byId('commit').addEventListener('click', () => {
  committed = true;
  const [kept, rejected, deferred] = Object.keys(labels).map(
    (code) => decisions.filter((decision) => decision === code).length
  );
  feedback(`Đã lưu lô mẫu: ${kept} giữ · ${rejected} từ chối · ${deferred} xem sau.`,
    `演示批次已保存：${kept} 通过 · ${rejected} 拒绝 · ${deferred} 稍后。`);
  render();
  byId('reset').focus();
});

byId('reset').addEventListener('click', () => {
  decisions.length = 0;
  committed = false;
  feedback('Dữ liệu mẫu. Duyệt thật trên Lark.', '演示语料，真实审核在 Lark。');
  render();
  buttons[0].focus();
});

render();
