/* ======================================================
   暖炉小馆 · 菜品展示页脚本 (dishes.js)
   功能：菜品数据渲染 + 菜系/热门度双重筛选
   依赖：无（原生 ES6+）
   ====================================================== */
(function () {
  'use strict';

  // ---------- 菜品数据（模拟，可替换为后端接口） ----------
  const DISHES = [
    // 川菜
    { id: 1,  name: '招牌红烧肉',    cuisine: 'sichuan',   popularity: 'hot',      price: 58, desc: '五花肉配冰糖慢炖，肥而不腻，入口即化。',   color1: '#8B4513', color2: '#D2691E', emoji: '🍖' },
    { id: 2,  name: '麻婆豆腐',      cuisine: 'sichuan',   popularity: 'recommend', price: 26, desc: '麻辣鲜香，嫩滑豆腐配上牛肉末。',             color1: '#C0392B', color2: '#E74C3C', emoji: '🥘' },
    { id: 3,  name: '宫保鸡丁',      cuisine: 'sichuan',   popularity: 'hot',      price: 38, desc: '经典川菜，鸡肉滑嫩，花生酥脆。',             color1: '#D35400', color2: '#F39C12', emoji: '🍗' },
    { id: 4,  name: '水煮鱼',        cuisine: 'sichuan',   popularity: 'recommend', price: 68, desc: '鲜嫩鱼片，麻辣鲜香，重口味首选。',           color1: '#922B21', color2: '#C0392B', emoji: '🐟' },

    // 鲁菜
    { id: 5,  name: '糖醋里脊',      cuisine: 'shandong',  popularity: 'hot',      price: 42, desc: '外酥里嫩，酸甜适口，小朋友最爱的味道。',     color1: '#FF6347', color2: '#FF8C69', emoji: '🍋' },
    { id: 6,  name: '九转大肠',      cuisine: 'shandong',  popularity: 'recommend', price: 58, desc: '鲁菜经典，酸、甜、香、辣俱全。',             color1: '#78281F', color2: '#B03A2E', emoji: '🍢' },
    { id: 7,  name: '葱烧海参',      cuisine: 'shandong',  popularity: 'recommend', price: 128, desc: '鲜嫩海参配大葱，营养价值丰富。',            color1: '#2E4053', color2: '#5D6D7E', emoji: '🦐' },

    // 江浙菜
    { id: 8,  name: '山味砂锅鸡',    cuisine: 'jiangsu',   popularity: 'hot',      price: 78, desc: '土鸡与野生菌菇同炖，汤鲜味浓，滋补首选。',   color1: '#CD853F', color2: '#DEB887', emoji: '🍲' },
    { id: 9,  name: '西湖醋鱼',      cuisine: 'jiangsu',   popularity: 'recommend', price: 56, desc: '鱼肉鲜嫩，酸甜适中，江南经典。',             color1: '#5D6D7E', color2: '#85929E', emoji: '🐠' },
    { id: 10, name: '东坡肉',        cuisine: 'jiangsu',   popularity: 'new',      price: 62, desc: '色泽红亮，酥而不碎，肥而不腻。',             color1: '#6E2C00', color2: '#A04000', emoji: '🥩' },

    // 粤菜
    { id: 11, name: '白切鸡',        cuisine: 'cantonese', popularity: 'hot',      price: 48, desc: '皮爽肉嫩，原汁原味，粤式经典。',             color1: '#F5CBA7', color2: '#FAD7A0', emoji: '🍗' },
    { id: 12, name: '清蒸鲈鱼',      cuisine: 'cantonese', popularity: 'recommend', price: 88, desc: '鲈鱼鲜嫩，豉油增香，清淡营养。',             color1: '#5DADE2', color2: '#AED6F1', emoji: '🐟' },
    { id: 13, name: '干炒牛河',      cuisine: 'cantonese', popularity: 'new',      price: 32, desc: '锅气十足，河粉爽滑，牛肉鲜嫩。',             color1: '#CA6F1E', color2: '#E67E22', emoji: '🍜' },

    // 素菜
    { id: 14, name: '蒜蓉时蔬',      cuisine: 'vegetable', popularity: 'hot',      price: 28, desc: '当日时令蔬菜，蒜末爆炒，清爽不油腻。',       color1: '#2E8B57', color2: '#98D98E', emoji: '🥬' },
    { id: 15, name: '地三鲜',        cuisine: 'vegetable', popularity: 'recommend', price: 26, desc: '茄子、土豆、青椒，家常下饭。',               color1: '#5B2C6F', color2: '#7D3C98', emoji: '🍆' },
    { id: 16, name: '清炒芥兰',      cuisine: 'vegetable', popularity: 'new',      price: 32, desc: '广东芥兰清炒，脆嫩爽口。',                   color1: '#1E8449', color2: '#58D68D', emoji: '🥗' },
    { id: 17, name: '上汤豆腐',      cuisine: 'vegetable', popularity: 'new',      price: 24, desc: '鲜浓上汤配嫩滑豆腐，口感细腻。',             color1: '#F9E79F', color2: '#F7DC6F', emoji: '🥣' },

    // 汤品
    { id: 18, name: '老鸭冬瓜汤',    cuisine: 'soup',      popularity: 'recommend', price: 48, desc: '老鸭与冬瓜慢炖，消暑解腻。',                 color1: '#7D6608', color2: '#F4D03F', emoji: '🍵' },
    { id: 19, name: '番茄蛋花汤',    cuisine: 'soup',      popularity: 'hot',      price: 18, desc: '家常番茄蛋花，酸甜开胃。',                   color1: '#E74C3C', color2: '#F5B041', emoji: '🥣' },
    { id: 20, name: '松茸老鸡汤',    cuisine: 'soup',      popularity: 'new',      price: 88, desc: '云南松茸配走地鸡，鲜香滋补。',               color1: '#5B4636', color2: '#8A6914', emoji: '🍲' }
  ];

  const CUISINE_LABEL = {
    sichuan: '川菜', shandong: '鲁菜', jiangsu: '江浙菜',
    cantonese: '粤菜', vegetable: '素菜', soup: '汤品'
  };
  const POP_LABEL = { hot: '热门', recommend: '推荐', new: '新上架' };
  const POP_TAG_CLASS = {
    hot: 'dish-tag', recommend: 'dish-tag', new: 'dish-tag'
  };

  // ---------- 状态 ----------
  const state = { cuisine: 'all', popularity: 'all' };

  // ---------- DOM ----------
  const grid      = document.getElementById('dish-grid');
  const empty     = document.getElementById('empty-state');
  const resultCnt = document.getElementById('result-count');

  if (!grid) return;

  // ---------- 渲染 ----------
  function render(list) {
    grid.innerHTML = '';

    if (!list.length) {
      empty.hidden = false;
      resultCnt.textContent = '0';
      return;
    }
    empty.hidden = true;
    resultCnt.textContent = list.length;

    list.forEach(function (d) {
      const card = document.createElement('article');
      card.className = 'dish-card fade-up is-visible'; // 菜品页直接显示，无需等待 IntersectionObserver
      card.innerHTML =
        '<div class="dish-img" style="background:linear-gradient(135deg,' + d.color1 + ' 0%,' + d.color2 + ' 100%);">' +
          '<span class="dish-img-text">' + d.emoji + '  ' + d.name + '</span>' +
        '</div>' +
        '<div class="dish-body">' +
          '<div class="dish-head">' +
            '<h3>' + escapeHtml(d.name) + '</h3>' +
            '<span class="dish-price">¥ ' + d.price + '</span>' +
          '</div>' +
          '<p class="dish-desc">' + escapeHtml(d.desc) + '</p>' +
          '<span class="' + POP_TAG_CLASS[d.popularity] + '">' + POP_LABEL[d.popularity] + ' · ' + CUISINE_LABEL[d.cuisine] + '</span>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  // ---------- 筛选 ----------
  function filter() {
    const list = DISHES.filter(function (d) {
      const okCuisine   = state.cuisine === 'all'   || d.cuisine   === state.cuisine;
      const okPopular   = state.popularity === 'all' || d.popularity === state.popularity;
      return okCuisine && okPopular;
    });
    render(list);
  }

  function bindFilterGroup(containerId, key) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener('click', function (e) {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      container.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
      btn.classList.add('active');
      state[key] = btn.dataset[key]; // data-cuisine / data-popularity
      filter();
    });
  }

  // ---------- XSS 防护 ----------
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- 初始化 ----------
  bindFilterGroup('filter-cuisine',   'cuisine');
  bindFilterGroup('filter-popularity', 'popularity');
  filter(); // 首次渲染

})();
