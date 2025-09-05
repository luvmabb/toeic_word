// 전역 캐시 (한 번만 불러오고 재사용)
let WORDS = [];

// 유틸: JSON 로드
async function loadWordsOnce() {
  if (WORDS.length) return WORDS;
  const res = await fetch('words.json');
  if (!res.ok) throw new Error('words.json 로드 실패');
  WORDS = await res.json();
  return WORDS;
}

// 오늘의 단어 표시
async function loadWord() {
  try {
    const words = await loadWordsOnce();
    const todayWord = words[Math.floor(Math.random() * words.length)];

    document.getElementById('word').textContent = todayWord.term ?? '';
    document.getElementById('pronunciation').textContent =
      todayWord.pronunciation ? `/${todayWord.pronunciation}/` : '';
    document.getElementById('meaning').textContent = todayWord.meaning ?? '';
    document.getElementById('example').textContent = todayWord.example ?? '';
  } catch (err) {
    console.error('JSON 불러오기 실패:', err);
  }
}

// 카테고리 버튼 클릭 시 호출
async function loadByCategory(cat) {
  try {
    const words = await loadWordsOnce();
    const list = words.filter(w => w.category === cat); // "형용사" | "동사" | "부사" | "전치사"
    renderList(list, cat);
  } catch (err) {
    console.error(err);
  }
}

// 목록 렌더 (카드/리스트 영역에 출력)
function renderList(list, cat) {
  const box = document.getElementById('listContainer');
  if (!box) {
    console.warn('#listContainer 가 없습니다. HTML에 추가하세요.');
    return;
  }
  box.innerHTML = `
    <div class="card">
      <h3>${cat} (${list.length}개)</h3>
      <ul class="word-list">
        ${list
          .map(
            (w) => `
            <li class="word-item">
              <span class="term">${w.term}</span>
              <span class="meaning">${w.meaning ?? ''}</span>
            </li>`
          )
          .join('')}
      </ul>
    </div>
  `;
}

// 학습 시작 (원하면 학습 페이지로 이동하도록 변경)
function startStudy() {
  alert('학습을 시작합니다!');
}

// 초기화: 오늘의 단어 + 카테고리 클릭 이벤트 연결
window.addEventListener('DOMContentLoaded', () => {
  loadWord();

  // HTML의 .category 요소에 data-cat="형용사" 같은 속성 필요
  document.querySelectorAll('.category').forEach((el) => {
    const cat = el.dataset.cat; // 예: "형용사"
    el.addEventListener('click', () => loadByCategory(cat));
    // 접근성/키보드
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadByCategory(cat);
      }
    });
  });
});
