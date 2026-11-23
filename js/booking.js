/* ======================================================
   暖炉小馆 · 预订页脚本 (booking.js)
   功能：日期最小值、人数 stepper、字符计数、
         表单校验 + 提交弹窗
   依赖：无（原生 ES6+）
   ====================================================== */
(function () {
  'use strict';

  const form = document.getElementById('booking-form');
  if (!form) return;

  // ---------- 1. 日期最小值 = 今天 ----------
  const dateInput = document.getElementById('b-date');
  if (dateInput) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    dateInput.min = y + '-' + m + '-' + d;
    // 默认选中明天
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    dateInput.value = tomorrow.getFullYear() + '-' +
      String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' +
      String(tomorrow.getDate()).padStart(2, '0');
  }

  // ---------- 2. 人数 stepper ----------
  const guestsInput = document.getElementById('b-guests');
  const stepBtns    = document.querySelectorAll('.step-btn');
  if (guestsInput && stepBtns.length) {
    stepBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cur = parseInt(guestsInput.value, 10) || 2;
        let next = cur;
        if (btn.dataset.action === 'plus' && cur < 20) next = cur + 1;
        else if (btn.dataset.action === 'minus' && cur > 1) next = cur - 1;
        guestsInput.value = next;
        clearError(guestsInput);
      });
    });
  }

  // ---------- 3. 字符计数 ----------
  const noteInput = document.getElementById('b-note');
  const charUsed  = document.getElementById('char-used');
  if (noteInput && charUsed) {
    const update = function () { charUsed.textContent = noteInput.value.length; };
    update();
    noteInput.addEventListener('input', update);
  }

  // ---------- 4. 表单校验 ----------
  const PHONE_RE = /^1[3-9]\d{9}$/;

  const rules = {
    'b-name': {
      required: true,
      validate: function (v) { return v.trim().length >= 2; },
      message: '请填写至少 2 个字符的姓名'
    },
    'b-phone': {
      required: true,
      validate: function (v) { return PHONE_RE.test(v.trim()); },
      message: '请输入正确的 11 位手机号'
    },
    'b-date': {
      required: true,
      validate: function (v) { return !!v; },
      message: '请选择预订日期'
    },
    'b-time': {
      required: true,
      validate: function (v) { return !!v; },
      message: '请选择到店时间'
    },
    'b-guests': {
      required: true,
      validate: function (v) {
        const n = parseInt(v, 10);
        return !isNaN(n) && n >= 1 && n <= 20;
      },
      message: '人数应为 1-20 之间'
    }
  };

  function showError(input, msg) {
    const group = input.closest('.form-group');
    const hint  = document.querySelector('.form-error[data-for="' + input.id + '"]');
    if (group) group.classList.add('has-error');
    if (hint) hint.textContent = msg || '';
  }
  function clearError(input) {
    const group = input.closest('.form-group');
    const hint  = document.querySelector('.form-error[data-for="' + input.id + '"]');
    if (group) group.classList.remove('has-error');
    if (hint) hint.textContent = '';
  }

  // 实时校验（失焦时）
  Object.keys(rules).forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', function () {
      validateField(el);
    });
    el.addEventListener('input', function () {
      if (el.closest('.form-group').classList.contains('has-error')) {
        validateField(el);
      }
    });
  });

  function validateField(el) {
    const rule = rules[el.id];
    if (!rule) return true;
    const v = el.value || '';
    if (rule.required && !v.trim()) {
      showError(el, rule.message);
      return false;
    }
    if (v.trim() && rule.validate && !rule.validate(v)) {
      showError(el, rule.message);
      return false;
    }
    clearError(el);
    return true;
  }

  function validateAll() {
    let ok = true;
    Object.keys(rules).forEach(function (id) {
      const el = document.getElementById(id);
      if (el && !validateField(el)) ok = false;
    });
    return ok;
  }

  // ---------- 5. 提交 ----------
  const submitBtn = document.getElementById('submit-btn');
  const modal     = document.getElementById('success-modal');
  const modalMsg  = document.getElementById('modal-msg');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateAll()) return;

    // 模拟提交（真实场景替换为 fetch / XHR）
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '提交中...';
    }

    setTimeout(function () {
      // 从 localStorage 读取偏好（体验增强：记忆手机号/姓名）
      const phone = document.getElementById('b-phone').value.trim();
      const name  = document.getElementById('b-name').value.trim();
      try { localStorage.setItem('nl_recent_booking', JSON.stringify({ phone: phone, name: name })); } catch (_) {}

      if (modalMsg) {
        modalMsg.innerHTML = '预订信息已提交，<strong>' + escapeHtml(name) + '</strong>，' +
          '我们将在 15 分钟内致电 <strong>' + escapeHtml(phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')) + '</strong> 确认。';
      }
      openModal();

      form.reset();
      if (guestsInput) guestsInput.value = 2;
      if (dateInput) dateInput.dispatchEvent(new Event('change'));
      if (charUsed)  charUsed.textContent = '0';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '确认预订';
      }
    }, 600);
  });

  // ---------- 6. 弹窗控制 ----------
  function openModal() {
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
  }
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  // ---------- 7. 从 localStorage 回填偏好 ----------
  try {
    const saved = localStorage.getItem('nl_recent_booking');
    if (saved) {
      const d = JSON.parse(saved);
      if (d.name)  document.getElementById('b-name').value  = d.name;
      if (d.phone) document.getElementById('b-phone').value = d.phone;
    }
  } catch (_) {}

  // ---------- 8. 转义 ----------
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
