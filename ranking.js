// ranking.js
async function loadRanking() {
  try {
    const res = await fetch('ranking.json');
    const data = await res.json();
    initRankingUI(data.categories);
  } catch (e) {
    console.error('ランキングデータの読み込みに失敗しました', e);
    const content = document.getElementById('category-content');
    content.textContent = 'ランキングデータを読み込めませんでした。';
  }
}

function initRankingUI(categories) {
  const tabs = document.getElementById('category-tabs');
  const content = document.getElementById('category-content');

  // タブ生成
  categories.forEach((cat, index) => {
    const btn = document.createElement('button');
    btn.textContent = cat.label;
    btn.className = 'tab-button';
    if (index === 0) btn.classList.add('active');

    btn.addEventListener('click', () => {
      document
        .querySelectorAll('.tab-button')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCategory(cat, content);
    });

    tabs.appendChild(btn);
  });

  // 最初のカテゴリを表示
  if (categories.length > 0) {
    renderCategory(categories[0], content);
  }
}

function renderCategory(category, container) {
  container.innerHTML = '';

  const list = document.createElement('ul');
  list.className = 'category-list';

  if (!category.items || category.items.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'まだランキングが登録されていません。集計中です。';
    container.appendChild(p);
    return;
  }

  // 念のため rank 順にソートし、5位までに制限
  const items = [...category.items]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5);

  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'category-item';

    const title = document.createElement('h3');
    title.innerHTML = `<span class="rank-badge">${item.rank}位</span>${item.name}`;
    li.appendChild(title);

    if (item.reason) {
      const reason = document.createElement('p');
      reason.textContent = item.reason;
      li.appendChild(reason);
    }

    if (item.url) {
      const urlDiv = document.createElement('div');
      urlDiv.className = 'facility-url';
      urlDiv.innerHTML = `<a href="${item.url}" target="_blank" rel="noopener">施設紹介ページを見る</a>`;
      li.appendChild(urlDiv);
    }

    list.appendChild(li);
  });

  container.appendChild(list);
}

loadRanking();
