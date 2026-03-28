const USER_KEY = 'rentafit-user';
const CART_KEY = 'rentafit-cart';
const ACCOUNTS_KEY = 'rentafit-accounts';

const DEMO_ACCOUNTS = [
  {
    name: 'Aanya Kapoor',
    email: 'renter@rentafit.demo',
    password: 'demo123',
    primaryRole: 'renter',
    roles: ['renter'],
    lenderStatus: 'none',
  },
  {
    name: 'Kabir Mehta',
    email: 'lender@rentafit.demo',
    password: 'demo123',
    primaryRole: 'lender',
    roles: ['renter', 'lender'],
    lenderStatus: 'approved',
  },
];

function emit(eventName) {
  window.dispatchEvent(new CustomEvent(eventName));
}

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function sanitizeUser(account) {
  if (!account) return null;
  const { password, ...user } = account;
  return user;
}

export function getRegisteredAccounts() {
  const accounts = readJson(ACCOUNTS_KEY, null);
  if (Array.isArray(accounts) && accounts.length > 0) {
    return accounts;
  }
  writeJson(ACCOUNTS_KEY, DEMO_ACCOUNTS);
  return DEMO_ACCOUNTS;
}

export function upsertRegisteredAccount(account) {
  const accounts = getRegisteredAccounts();
  const next = [...accounts];
  const index = next.findIndex((item) => item.email.toLowerCase() === account.email.toLowerCase());
  const existingPassword = index >= 0 ? next[index].password : undefined;
  const merged = {
    ...(index >= 0 ? next[index] : {}),
    ...account,
    password: account.password ?? existingPassword ?? 'demo123',
  };

  if (index >= 0) next[index] = merged;
  else next.unshift(merged);

  writeJson(ACCOUNTS_KEY, next);
  return merged;
}

export function loginUser({ email, password }) {
  const accounts = getRegisteredAccounts();
  const found = accounts.find((item) => item.email.toLowerCase() === String(email).toLowerCase() && item.password === password);
  if (!found) return null;
  const user = sanitizeUser(found);
  saveCurrentUser(user);
  return user;
}

export function registerAccount(formData) {
  const wantsLender = formData.primaryRole === 'lender';
  const account = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    primaryRole: wantsLender ? 'lender' : 'renter',
    roles: wantsLender ? ['renter', 'lender'] : ['renter'],
    lenderStatus: wantsLender ? 'approved' : 'none',
  };

  const stored = upsertRegisteredAccount(account);
  const user = sanitizeUser(stored);
  saveCurrentUser(user);
  return user;
}

export function getCurrentUser() {
  return readJson(USER_KEY, null);
}

export function saveCurrentUser(user) {
  writeJson(USER_KEY, user);
  emit('rentafit:user-updated');
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_KEY);
  emit('rentafit:user-updated');
}

export function hasLenderAccess(user) {
  if (!user) return false;
  return user.primaryRole === 'lender' || user.lenderStatus === 'approved' || user.roles?.includes('lender');
}

export function enableLenderAccess(user, verification = {}) {
  const upgraded = {
    ...user,
    primaryRole: 'lender',
    roles: Array.from(new Set([...(user.roles || [user.primaryRole || 'renter']), 'lender'])),
    lenderStatus: 'approved',
    lenderVerification: {
      ...verification,
      approvedAt: new Date().toISOString(),
      mode: 'frontend-demo',
    },
  };
  saveCurrentUser(upgraded);
  upsertRegisteredAccount(upgraded);
  return upgraded;
}

export function getCartItems() {
  return readJson(CART_KEY, []);
}

export function saveCartItems(items) {
  writeJson(CART_KEY, items);
  emit('rentafit:cart-updated');
}

export function addToCart(product, { size, durationKey, quantity = 1 }) {
  const nextQuantity = Math.max(1, Number(quantity) || 1);
  const existing = getCartItems();
  const lineId = `${product.id}-${size}-${durationKey}`;
  const found = existing.find((item) => item.lineId === lineId);

  if (found) {
    found.quantity += nextQuantity;
  } else {
    existing.push({
      lineId,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      gender: product.gender,
      size,
      durationKey,
      price: product.price,
      imageToken: product.imageTokens?.[0] || null,
      imageUrl: product.mainImageUrl || product.imageTokens?.[0]?.imageUrl || '',
      quantity: nextQuantity,
    });
  }

  saveCartItems(existing);
}

export function updateCartDuration(lineId, durationKey) {
  const items = getCartItems().map((item) => (item.lineId === lineId ? { ...item, durationKey } : item));
  saveCartItems(items);
}

export function updateCartQuantity(lineId, quantity) {
  const nextQuantity = Math.max(1, Number(quantity) || 1);
  const items = getCartItems().map((item) => (item.lineId === lineId ? { ...item, quantity: nextQuantity } : item));
  saveCartItems(items);
}

export function incrementCartQuantity(lineId) {
  const items = getCartItems().map((item) => (
    item.lineId === lineId ? { ...item, quantity: Number(item.quantity || 1) + 1 } : item
  ));
  saveCartItems(items);
}

export function decrementCartQuantity(lineId) {
  const items = getCartItems().map((item) => (
    item.lineId === lineId
      ? { ...item, quantity: Math.max(1, Number(item.quantity || 1) - 1) }
      : item
  ));
  saveCartItems(items);
}

export function removeCartItem(lineId) {
  const items = getCartItems().filter((item) => item.lineId !== lineId);
  saveCartItems(items);
}

export function clearCart() {
  saveCartItems([]);
}

export function getCartCount() {
  return getCartItems().length;
}
