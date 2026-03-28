import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK_API || 'true').toLowerCase() === 'true';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

function buildMockPriceRange(payload) {
  const original = Number(payload.original_price || 0);
  const category = String(payload.category || '').toLowerCase();
  let minPct = 0.08;
  let maxPct = 0.12;

  if (['dress', 'lehenga', 'saree', 'ethnic wear'].includes(category)) {
    minPct = 0.11;
    maxPct = 0.15;
  } else if (['shirt', 'top', 'jeans', 'activewear'].includes(category)) {
    minPct = 0.05;
    maxPct = 0.09;
  }

  return {
    final_price_range: {
      min_price: Math.max(60, Math.round(original * minPct / 10) * 10),
      max_price: Math.max(80, Math.round(original * maxPct / 10) * 10),
      source: 'catalog_range_estimate',
    },
    predicted_price_mid: Math.round(original * ((minPct + maxPct) / 2) / 10) * 10,
    confidence: { score: 0.82 },
  };
}

function buildMockModelBResponse(payload) {
  const gender = String(payload.gender || '').trim();
  const category = String(payload.category || '').trim();
  const providerPrice = Number(payload.provider_price || 0);
  const originalPrice = Number(payload.original_price || 0);
  const garmentAge = Number(payload.garment_age_months || 0);
  const womenOnly = ['Saree', 'Lehenga', 'Dress', 'Top'];
  const genderConflict = gender === 'Men' && womenOnly.includes(category);
  const tooHigh = originalPrice > 0 && providerPrice > originalPrice * 0.35;
  const stale = garmentAge >= 10;

  let predictedDecision = 'Approve';
  let status = 'ACTIVE';
  let popup = false;
  let popupMessage = '';

  if (tooHigh) {
    predictedDecision = 'Reject';
    status = 'REJECTED';
  } else if (genderConflict) {
    predictedDecision = 'Review';
    status = 'PENDING_REVIEW';
    popup = true;
    popupMessage = 'Selected gender does not match the current category policy. This listing should be reviewed before activation.';
  } else if (stale) {
    predictedDecision = 'Review';
    status = 'REAPPROVAL_REQUIRED';
  }

  return {
    prediction: {
      predicted_decision: predictedDecision,
      suggested_listing_status: status,
    },
    lifecycle: {
      next_status: status,
      review_required: status !== 'ACTIVE',
      visible_to_renters: status === 'ACTIVE',
      stale_listing_flag: stale,
      frontend_popup_recommended: popup,
      frontend_popup_message: popupMessage,
    },
    summary: {
      predicted_decision: predictedDecision,
      suggested_listing_status: status,
      frontend_popup_recommended: popup,
    },
  };
}

async function safeApiCall(runMock, requestFn) {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(runMock()), 350));
  }
  try {
    const response = await requestFn();
    return response.data;
  } catch {
    return runMock();
  }
}

export async function predictRentalPrice(payload) {
  return safeApiCall(
    () => buildMockPriceRange(payload),
    () => api.post('/api/predict-price', payload),
  );
}

export async function predictListingDecision(payload) {
  return safeApiCall(
    () => buildMockModelBResponse(payload),
    () => api.post('/api/model-b/predict', payload),
  );
}

export async function recommendItems(payload) {
  return safeApiCall(
    () => ({ query_mode: payload.seed_item_id ? 'item_to_item' : 'profile_from_liked_items', recommendations: [] }),
    () => api.post('/api/model-c/recommend', payload),
  );
}

export async function fetchModelCSamples() {
  return safeApiCall(
    () => ({ items: [] }),
    () => api.get('/api/model-c/samples'),
  );
}

export default api;
