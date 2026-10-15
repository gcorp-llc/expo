// App State & Data Store
const state = {
  theme: 'light',
  currentRoute: '/',
  activeTab: 'index',
  viewMode: 'normal', // 'normal', 'loading', 'empty', 'error'
  cartCount: 2,
  unreadChats: 2,
  user: {
    name: 'رضا کریمی',
    phone: '09123456789',
    shopName: 'فروشگاه دیجیتال رضا',
  }
};

// SVG Icon Helper
function getIcon(name, size = 20) {
  const icons = {
    'home': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>`,
    'shop': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>`,
    'add': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    'chat': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>`,
    'settings': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
    'back': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
    'search': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
    'filter': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>`,
    'heart': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    'cart': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
    'bell': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>`,
  };
  return icons[name] || '';
}

// Navigation Logic
function navigateTo(route) {
  state.currentRoute = route;

  // Highlight sidebar
  document.querySelectorAll('.route-item').forEach(el => {
    el.classList.toggle('active', el.dataset.route === route);
  });

  // Highlight tab bar
  const tabMap = {
    '/(tabs)': 'index',
    '/(tabs)/shop': 'shop',
    '/(tabs)/sell': 'sell',
    '/(tabs)/chat': 'chat',
    '/(tabs)/settings': 'settings'
  };
  const activeTabKey = tabMap[route] || '';
  document.querySelectorAll('.tab-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === activeTabKey);
  });

  renderScreen(route);
}

// Screen Renderer
function renderScreen(route) {
  const container = document.getElementById('viewport-screen');
  let content = '';

  if (state.viewMode === 'loading') {
    container.innerHTML = `
      <div class="modern-header"><div class="header-title">بارگذاری...</div></div>
      <div class="screen-content" style="align-items:center; justify-center; height:100%;">
        <div style="font-size:14px; color:var(--text-secondary);">در حال دریافت اطلاعات...</div>
      </div>`;
    return;
  }

  if (state.viewMode === 'empty') {
    container.innerHTML = `
      <div class="modern-header">
        <div class="floating-icon-btn" onclick="navigateTo('/(tabs)')">${getIcon('back')}</div>
        <div class="header-title">لیست خالی</div>
      </div>
      <div class="screen-content" style="align-items:center; justify-content:center; height:80%; gap:12px;">
        <div style="font-size:40px;">📭</div>
        <div style="font-size:16px; font-weight:700;">هیچ داده‌ای یافت نشد</div>
        <div style="font-size:13px; color:var(--text-secondary);">آیتمی برای نمایش وجود ندارد.</div>
      </div>`;
    return;
  }

  // Route Views
  switch (route) {
    case '/':
    case '/(tabs)':
      content = renderHomeTab();
      break;
    case '/(tabs)/shop':
      content = renderShopTab();
      break;
    case '/(tabs)/sell':
      content = renderSellTab();
      break;
    case '/(tabs)/chat':
      content = renderChatTab();
      break;
    case '/(tabs)/settings':
      content = renderSettingsTab();
      break;
    case '/cart':
      content = renderCartScreen();
      break;
    case '/checkout':
      content = renderCheckoutScreen();
      break;
    case '/notifications':
      content = renderNotificationsScreen();
      break;
    case '/chat/1':
      content = renderDirectChatScreen();
      break;
    case '/auth/welcome':
      content = renderAuthWelcomeScreen();
      break;
    case '/auth/phone':
      content = renderAuthPhoneScreen();
      break;
    case '/auth/verify':
      content = renderAuthVerifyScreen();
      break;
    default:
      content = renderGenericScreen(route);
      break;
  }

  container.innerHTML = content;
}

// Render Functions for Primary Screens
function renderHomeTab() {
  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="openBottomSheet('filter')">${getIcon('filter')}</div>
      <div class="header-title">کوتیک (Kutik)</div>
      <div style="display:flex; gap:8px;">
        <div class="floating-icon-btn" onclick="navigateTo('/cart')">${getIcon('cart')}</div>
        <div class="floating-icon-btn" onclick="navigateTo('/notifications')">${getIcon('bell')}</div>
      </div>
    </div>
    <div class="screen-content">
      <div class="card" style="background: linear-gradient(135deg, #3a93e6, #1d619e); color: #fff;">
        <div style="font-size: 18px; font-weight: 800;">تخفیف‌های ویژه بهاره 🌸</div>
        <div style="font-size: 13px; opacity: 0.9;">تا ۵۰٪ تخفیف روی تمامی محصولات منتخب دیجیتال</div>
        <button class="btn-secondary" style="margin-top:8px; border:none; color:#1d619e; font-weight:700;" onclick="navigateTo('/(tabs)/shop')">مشاهده محصولات</button>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:15px; font-weight:700;">دسته‌بندی‌های پیشنهادی</span>
        <span style="font-size:12px; color:var(--tint-color); font-weight:600; cursor:pointer;" onclick="navigateTo('/(tabs)/shop')">همه</span>
      </div>

      <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:4px;">
        <div class="card" style="min-width:100px; align-items:center; padding:12px; cursor:pointer;" onclick="navigateTo('/(tabs)/shop')">
          <div style="font-size:24px;">📱</div>
          <div style="font-size:12px; font-weight:600;">دیجیتال</div>
        </div>
        <div class="card" style="min-width:100px; align-items:center; padding:12px; cursor:pointer;" onclick="navigateTo('/(tabs)/shop')">
          <div style="font-size:24px;">👕</div>
          <div style="font-size:12px; font-weight:600;">پوشاک</div>
        </div>
        <div class="card" style="min-width:100px; align-items:center; padding:12px; cursor:pointer;" onclick="navigateTo('/(tabs)/shop')">
          <div style="font-size:24px;">🏠</div>
          <div style="font-size:12px; font-weight:600;">خانه</div>
        </div>
        <div class="card" style="min-width:100px; align-items:center; padding:12px; cursor:pointer;" onclick="navigateTo('/(tabs)/shop')">
          <div style="font-size:24px;">📚</div>
          <div style="font-size:12px; font-weight:600;">کتاب</div>
        </div>
      </div>

      <div style="font-size:15px; font-weight:700; margin-top:8px;">جدیدترین آگهی‌ها</div>
      <div class="product-card-grid">
        <div class="product-item" onclick="navigateTo('/product/p1')">
          <img src="https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=400&auto=format&fit=crop" />
          <div class="product-info">
            <div class="product-title">آیفون ۱۵ پرو ۲۵۶ گیگ</div>
            <div class="product-price">۹۹۹ $</div>
          </div>
        </div>
        <div class="product-item" onclick="navigateTo('/product/p2')">
          <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop" />
          <div class="product-info">
            <div class="product-title">مک‌بوک ایر M2</div>
            <div class="product-price">۱,۱۹۹ $</div>
          </div>
        </div>
      </div>
    </div>`;
}

function renderShopTab() {
  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="openBottomSheet('filter')">${getIcon('filter')}</div>
      <div class="header-title">فروشگاه و بازار</div>
      <div class="floating-icon-btn" onclick="navigateTo('/cart')">${getIcon('cart')}</div>
    </div>
    <div class="screen-content">
      <div class="input-group">
        <input type="text" class="input-field" placeholder="جستجو در تمام فروشگاه‌ها..." />
      </div>
      <div class="product-card-grid">
        <div class="product-item" onclick="navigateTo('/product/p1')">
          <img src="https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=400&auto=format&fit=crop" />
          <div class="product-info">
            <div class="product-title">آیفون ۱۵ پرو</div>
            <div class="product-price">۹۹۹ $</div>
          </div>
        </div>
        <div class="product-item" onclick="navigateTo('/product/p3')">
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop" />
          <div class="product-info">
            <div class="product-title">ساعت چرمی مینیمال</div>
            <div class="product-price">۱۱۲ $</div>
          </div>
        </div>
        <div class="product-item" onclick="navigateTo('/product/p4')">
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop" />
          <div class="product-info">
            <div class="product-title">هدفون بیسیم سونی</div>
            <div class="product-price">۳۴۹ $</div>
          </div>
        </div>
        <div class="product-item" onclick="navigateTo('/product/p5')">
          <img src="https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400&auto=format&fit=crop" />
          <div class="product-info">
            <div class="product-title">صندلی ارگونومیک</div>
            <div class="product-price">۲۹۹ $</div>
          </div>
        </div>
      </div>
    </div>`;
}

function renderSellTab() {
  return `
    <div class="modern-header">
      <div class="header-title">ثبت آگهی جدید</div>
    </div>
    <div class="screen-content">
      <div class="card">
        <div class="input-group">
          <label class="input-label">عنوان آگهی</label>
          <input type="text" class="input-field" placeholder="مثلاً: آیفون ۱۳ در حد نو" />
        </div>
        <div class="input-group">
          <label class="input-label">قیمت (تومان)</label>
          <input type="number" class="input-field" placeholder="مثلاً: ۴۵,۰۰۰,۰۰۰" />
        </div>
        <div class="input-group">
          <label class="input-label">توضیحات</label>
          <textarea class="input-field" style="height:90px; padding-top:10px;" placeholder="مشخصات و جزئیات کالا..."></textarea>
        </div>
        <button class="btn-primary" style="margin-top:10px;" onclick="alert('آگهی با موفقیت ثبت شد')">انتشار آگهی</button>
      </div>
    </div>`;
}

function renderChatTab() {
  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="navigateTo('/chat/contacts')">${getIcon('search')}</div>
      <div class="header-title">پیام‌ها (۴)</div>
      <div class="floating-icon-btn" onclick="openBottomSheet('new-chat')">${getIcon('add')}</div>
    </div>
    <div class="screen-content">
      <div class="chat-item" onclick="navigateTo('/chat/1')">
        <div class="chat-avatar">
          <img src="https://i.pravatar.cc/150?u=1" />
          <div class="online-indicator"></div>
        </div>
        <div class="chat-details">
          <div class="chat-row-1">
            <span class="chat-name">علی احمدی</span>
            <span class="chat-time">۱۰:۳۰</span>
          </div>
          <div class="chat-row-1">
            <span class="chat-message">سلام، محصولات جدید کی میرسن؟</span>
            <span class="badge">۲</span>
          </div>
        </div>
      </div>

      <div class="chat-item" onclick="navigateTo('/chat/group/1')">
        <div class="chat-avatar" style="background:#e0e5eb;">👥</div>
        <div class="chat-details">
          <div class="chat-row-1">
            <span class="chat-name">گروه عمده فروشی</span>
            <span class="chat-time">دیروز</span>
          </div>
          <div class="chat-message">رضا: قیمت‌ها آپدیت شد.</div>
        </div>
      </div>

      <div class="chat-item" onclick="navigateTo('/chat/channel/1')">
        <div class="chat-avatar" style="background:#3a93e6; color:#fff;">📢</div>
        <div class="chat-details">
          <div class="chat-row-1">
            <span class="chat-name">کانال تخفیف‌های کوتیک</span>
            <span class="chat-time">۹:۱۵</span>
          </div>
          <div class="chat-row-1">
            <span class="chat-message">تخفیف ۵۰ درصدی برای محصولات چرمی!</span>
            <span class="badge">۵</span>
          </div>
        </div>
      </div>
    </div>`;
}

function renderSettingsTab() {
  return `
    <div class="modern-header">
      <div class="header-title">تنظیمات و حساب کاربری</div>
    </div>
    <div class="screen-content">
      <div class="card" style="flex-direction:row; align-items:center; gap:14px;" onclick="navigateTo('/settings/edit-profile')">
        <div class="chat-avatar" style="width:56px; height:56px; font-size:20px;">ر</div>
        <div style="display:flex; flex-direction:column; gap:4px; flex:1;">
          <span style="font-size:16px; font-weight:700;">${state.user.name}</span>
          <span style="font-size:12px; color:var(--text-secondary);">${state.user.phone}</span>
        </div>
        <span style="font-size:12px; color:var(--tint-color); font-weight:600;">ویرایش</span>
      </div>

      <div class="card" style="padding:8px 16px;">
        <div style="padding:12px 0; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; cursor:pointer;" onclick="navigateTo('/settings/orders')">
          <span>📦 سفارش‌های من</span>
          <span style="color:var(--text-secondary);">›</span>
        </div>
        <div style="padding:12px 0; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; cursor:pointer;" onclick="navigateTo('/settings/finance')">
          <span>💳 کیف پول و مالی</span>
          <span style="color:var(--text-secondary);">›</span>
        </div>
        <div style="padding:12px 0; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; cursor:pointer;" onclick="navigateTo('/settings/shop-management')">
          <span>🏪 مدیریت فروشگاه</span>
          <span style="color:var(--text-secondary);">›</span>
        </div>
        <div style="padding:12px 0; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; cursor:pointer;" onclick="navigateTo('/settings/language')">
          <span>🌐 زبان (Language)</span>
          <span style="color:var(--text-secondary);">فارسی ›</span>
        </div>
        <div style="padding:12px 0; display:flex; justify-content:space-between; cursor:pointer;" onclick="navigateTo('/settings/theme')">
          <span>🌙 پوسته برنامه</span>
          <span style="color:var(--text-secondary);">${state.theme === 'dark' ? 'تاریک' : 'روشن'} ›</span>
        </div>
      </div>
    </div>`;
}

function renderCartScreen() {
  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="navigateTo('/(tabs)')">${getIcon('back')}</div>
      <div class="header-title">سبد خرید (۲)</div>
    </div>
    <div class="screen-content">
      <div class="card" style="flex-direction:row; gap:12px; align-items:center;">
        <img src="https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=400&auto=format&fit=crop" style="width:64px; height:64px; border-radius:12px; object-fit:cover;" />
        <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
          <span style="font-size:14px; font-weight:700;">آیفون ۱۵ پرو</span>
          <span style="font-size:14px; font-weight:800; color:var(--tint-color);">۹۹۹ $</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; background:var(--secondary-bg); padding:4px 8px; border-radius:8px;">
          <button style="border:none; background:none; font-weight:700;">+</button>
          <span>۱</span>
          <button style="border:none; background:none; font-weight:700;">-</button>
        </div>
      </div>

      <div class="card" style="margin-top:auto;">
        <div style="display:flex; justify-content:space-between; font-size:14px; font-weight:600;">
          <span>جمع کل:</span>
          <span style="color:var(--tint-color); font-weight:800;">۱,۱۱۱ $</span>
        </div>
        <button class="btn-primary" onclick="navigateTo('/checkout')">ادامه فرایند خرید</button>
      </div>
    </div>`;
}

function renderCheckoutScreen() {
  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="navigateTo('/cart')">${getIcon('back')}</div>
      <div class="header-title">تکمیل سفارش</div>
    </div>
    <div class="screen-content">
      <div class="card">
        <span style="font-size:14px; font-weight:700;">آدرس تحویل</span>
        <span style="font-size:13px; color:var(--text-secondary);">تهران، خیابان آزادی، پلاک ۱۲</span>
      </div>

      <div class="card">
        <span style="font-size:14px; font-weight:700;">روش پرداخت</span>
        <div style="display:flex; gap:10px; margin-top:8px;">
          <button class="btn-secondary" style="border-color:var(--tint-color);">پرداخت آنلاین</button>
          <button class="btn-secondary">کیف پول</button>
        </div>
      </div>

      <button class="btn-primary" style="margin-top:auto;" onclick="alert('سفرش با موفقیت ثبت گردید!'); navigateTo('/(tabs)');">پرداخت و نهایی‌سازی</button>
    </div>`;
}

function renderNotificationsScreen() {
  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="navigateTo('/(tabs)')">${getIcon('back')}</div>
      <div class="header-title">اعلان‌ها</div>
    </div>
    <div class="screen-content">
      <div class="card">
        <span style="font-size:14px; font-weight:700;">📦 سفارش ارسال شد</span>
        <span style="font-size:12px; color:var(--text-secondary);">سفارش #1024 تحویل پست گردید.</span>
      </div>
      <div class="card">
        <span style="font-size:14px; font-weight:700;">🎉 تخفیف جدید</span>
        <span style="font-size:12px; color:var(--text-secondary);">کد تخفیف ۲۰٪ ویژه شما فعال شد.</span>
      </div>
    </div>`;
}

function renderDirectChatScreen() {
  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="navigateTo('/(tabs)/chat')">${getIcon('back')}</div>
      <div class="header-title">علی احمدی</div>
    </div>
    <div class="screen-content" style="gap:10px;">
      <div style="align-self:flex-start; background:var(--card-bg); border:1px solid var(--border-color); padding:10px 14px; border-radius:16px; border-bottom-right-radius:4px; max-width:80%; font-size:13px;">
        سلام، محصولات جدید کی میرسن؟
      </div>
      <div style="align-self:flex-end; background:var(--tint-color); color:#fff; padding:10px 14px; border-radius:16px; border-bottom-left-radius:4px; max-width:80%; font-size:13px;">
        سلام علی جان، احتمالا تا آخر هفته موجود میشن.
      </div>
      <div class="input-group" style="margin-top:auto; flex-direction:row; gap:8px;">
        <input type="text" class="input-field" style="flex:1;" placeholder="پیام خود را بنویسید..." />
        <button class="btn-primary" style="width:48px;">➔</button>
      </div>
    </div>`;
}

function renderAuthWelcomeScreen() {
  return `
    <div class="screen-content" style="align-items:center; justify-content:center; text-align:center; gap:20px;">
      <div style="font-size:64px;">🛍️</div>
      <div style="font-size:24px; font-weight:800;">به کوتیک خوش آمدید</div>
      <div style="font-size:14px; color:var(--text-secondary); max-width:280px;">پلتفرم هوشمند خرید، فروش و گفتگو مستقیم با فروشندگان</div>
      <button class="btn-primary" style="margin-top:20px;" onclick="navigateTo('/auth/phone')">ورود / ثبت‌نام</button>
    </div>`;
}

function renderAuthPhoneScreen() {
  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="navigateTo('/auth/welcome')">${getIcon('back')}</div>
      <div class="header-title">ورود با شماره موبایل</div>
    </div>
    <div class="screen-content" style="gap:16px;">
      <div class="input-group">
        <label class="input-label">شماره همراه</label>
        <input type="tel" class="input-field" placeholder="09123456789" />
      </div>
      <button class="btn-primary" onclick="navigateTo('/auth/verify')">ارسال کد تأیید</button>
    </div>`;
}

function renderAuthVerifyScreen() {
  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="navigateTo('/auth/phone')">${getIcon('back')}</div>
      <div class="header-title">تأیید شماره</div>
    </div>
    <div class="screen-content" style="gap:16px; text-align:center;">
      <span style="font-size:13px; color:var(--text-secondary);">کد ۵ رقمی ارسال‌شده را وارد کنید</span>
      <div style="display:flex; gap:8px; justify-content:center;">
        <input class="input-field" style="width:40px; text-align:center;" maxlength="1" />
        <input class="input-field" style="width:40px; text-align:center;" maxlength="1" />
        <input class="input-field" style="width:40px; text-align:center;" maxlength="1" />
        <input class="input-field" style="width:40px; text-align:center;" maxlength="1" />
        <input class="input-field" style="width:40px; text-align:center;" maxlength="1" />
      </div>
      <button class="btn-primary" onclick="navigateTo('/(tabs)')">تأیید و ورود</button>
    </div>`;
}

function renderGenericScreen(route) {
  const titleMap = {
    '/settings/edit-profile': 'ویرایش پروفایل',
    '/settings/orders': 'سفارش‌های من',
    '/settings/finance': 'کیف پول و مال',
    '/settings/analytics': 'آمار و گزارش‌ها',
    '/settings/addresses': 'آدرس‌های ثبت‌شده',
    '/settings/shop-management': 'مدیریت فروشگاه',
    '/settings/shop-staff': 'مدیریت کارمندان',
    '/settings/notification-settings': 'تنظیمات اعلانات',
    '/settings/message-settings': 'تنظیمات پیام‌ها',
    '/settings/language': 'تنظیمات زبان',
    '/settings/theme': 'تنظیمات پوسته',
    '/settings/privacy': 'حریم خصوصی و امنیت',
    '/settings/help': 'راهنما و پشتیبانی',
    '/shop/create': 'ایجاد فروشگاه جدید',
    '/shop/manage': 'داشبورد فروشگاه',
    '/shop/add-product': 'افزودن محصول جدید',
    '/shop/reviews': 'نظرات مشتریان',
    '/chat/contacts': 'مخاطبین',
    '/chat/calls/voice': 'تماس صوتی',
    '/chat/calls/video': 'تماس تصویری',
  };
  const title = titleMap[route] || route;

  return `
    <div class="modern-header">
      <div class="floating-icon-btn" onclick="navigateTo('/(tabs)')">${getIcon('back')}</div>
      <div class="header-title">${title}</div>
    </div>
    <div class="screen-content">
      <div class="card">
        <span style="font-size:15px; font-weight:700;">صفحه ${title}</span>
        <span style="font-size:13px; color:var(--text-secondary);">مسیر پروژه: ${route}</span>
        <p style="font-size:13px; line-height:1.5;">این صفحه به عنوان مرجع بصری و ساختاری UI بازسازی شده است.</p>
      </div>
    </div>`;
}

// Modal & BottomSheet Trigger
function openBottomSheet(type) {
  const overlay = document.getElementById('modal-overlay');
  const sheet = document.getElementById('bottom-sheet-content');
  overlay.classList.add('active');

  if (type === 'filter') {
    sheet.innerHTML = `
      <div class="sheet-handle"></div>
      <span style="font-size:16px; font-weight:700;">فیلتر محصولات</span>
      <div class="input-group">
        <label class="input-label">محدوده قیمت</label>
        <input type="range" style="width:100%;" />
      </div>
      <button class="btn-primary" onclick="closeBottomSheet()">اعمال فیلتر</button>`;
  } else if (type === 'new-chat') {
    sheet.innerHTML = `
      <div class="sheet-handle"></div>
      <span style="font-size:16px; font-weight:700;">ایجاد گفتگو جدید</span>
      <button class="btn-secondary" onclick="closeBottomSheet(); navigateTo('/chat/1')">💬 پیام مستقیم جدید</button>
      <button class="btn-secondary" onclick="closeBottomSheet(); navigateTo('/chat/group/create-details')">👥 ایجاد گروه جدید</button>
      <button class="btn-secondary" onclick="closeBottomSheet(); navigateTo('/chat/channel/create-details')">📢 ایجاد کانال جدید</button>`;
  }
}

function closeBottomSheet() {
  document.getElementById('modal-overlay').classList.remove('active');
}

// Controls
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('theme-toggle-btn').innerText = state.theme === 'dark' ? '☀️ روشن' : '🌙 تاریک';
}

function setViewMode(mode) {
  state.viewMode = mode;
  renderScreen(state.currentRoute);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  renderScreen('/');
});
