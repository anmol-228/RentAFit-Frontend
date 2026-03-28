# RentAFit Frontend

Work-in-progress React + Bootstrap frontend for the `Rent a Fit` renter and lender experience.

## Status
- This repository represents the current frontend product pass, not a finished production release.
- The public GitHub Pages build is meant to show the UI, navigation, and core renter/lender flows while backend integration is still being completed.
- Some flows still rely on mock responses, browser storage, and placeholder behavior where the full platform is still under development.

## Live Demo
- GitHub repo: `anmol-228/RentAFit-Frontend`
- GitHub Pages: `https://anmol-228.github.io/RentAFit-Frontend/`

The current app is intentionally **frontend-first** and still under active development:
- placeholder visuals instead of final product photos
- live search, cart, auth, and lender flows in the UI
- mock-first ML integration so the frontend works even without a running backend
- try-on shown as a **UI placeholder modal only**

## Tech Stack
- React 18
- React Router v6
- Bootstrap 5
- Axios
- Vite

## Run
```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Environment
Create a `.env` file in `/Users/mypc/RentAFit/web_app` or copy `.env.example`.

Recommended frontend-only setup:

```env
VITE_API_BASE=http://localhost:8000
VITE_USE_MOCK_API=true
```

When `VITE_USE_MOCK_API=true`, the app uses safe mock responses for:
- Model A price prediction
- Model B moderation/status prediction
- Model C recommendations if the backend is unavailable

If you later want to connect the real API, switch:

```env
VITE_USE_MOCK_API=false
```

## Main Routes
- `/`
  Premium landing page with hero carousel, trending looks, recent uploads, CTA section, and trust section.
- `/products`
  Main product browsing page with filters for gender, category, price range, and sorting.
- `/products/:productId`
  Product detail page with size selection, add-to-cart flow, try-on UI trigger, and recommendations.
- `/cart`
  Cart page with rental duration selector, billing summary, and recommended products.
- `/faq`
  FAQ and rental policy page.
- `/login`
  Login page.
- `/signup`
  Signup page.
- `/lender/dashboard`
  Lender dashboard with listing stats and current uploads.
- `/lender/upload`
  Lender upload form collecting product details, pricing, and placeholders for images.
- `/lender/price`
  Result page showing Model A price guidance and Model B moderation/status result.

## Frontend Features

### Navbar
- brand wordmark
- live search modal
- cart icon with badge
- lender entry button
- profile dropdown for login, signup, and logout

### Homepage
- gender-based hero carousel
- trending outfits
- recent uploads
- "Start Renting" CTA
- trust and rental-information section
- footer with FAQ and category links

### Product Browsing
- category and gender filters
- price-band filtering
- sorting
- reusable product cards
- placeholder visuals instead of custom images

### Product Detail
- large hero visual with thumbnails
- size selection
- add to cart
- try-on button
- recommendation rail

### Cart
- duration selector
- subtotal and total calculation
- remove-item flow
- recommendation rail below cart

### Lender Flow
- upload form with clothing metadata
- frontend preview for uploaded images
- Model A predicted rental range
- Model B moderation result and status
- gender-conflict popup support
- dashboard with stored local listings

## Try-On Status
Try-on is currently **frontend-only**.

What exists:
- try-on button on product cards and product detail page
- polished modal layout
- user image upload field
- body-details inputs

What does not exist yet:
- diffusion backend
- real generated try-on output
- production image-processing pipeline

## Placeholder Assets
You do **not** need to prepare custom images right now.

The app already uses:
- gradient clothing placeholders
- mock product catalog data
- realistic sample descriptions and pricing

You can replace these later with:
- real listing photos
- final product descriptions
- logo asset if needed

## ML/API Wiring
The frontend is prepared to work with:
- `POST /api/predict-price`
- `POST /api/model-b/predict`
- `POST /api/model-c/recommend`
- `GET /api/model-c/samples`

In mock mode, the frontend still works even if these endpoints are not running.

## Notes
- Search, cart, auth, and lender listings use browser storage for the current frontend pass.
- The recommendation experience is embedded into product detail and cart flows rather than using a separate renter recommendations route.
- This frontend is still a work in progress and is being prepared step by step for deeper backend integration.
- Some renter, lender, and ML-driven flows are currently simulated so the UI can be reviewed before the full platform wiring is complete.
- GitHub Pages deployment is meant to run in mock mode so the public demo stays usable without the Spring or Python services.
