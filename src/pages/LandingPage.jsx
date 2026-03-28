import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import ProductRail from '../components/ProductRail';
import SiteFooter from '../components/SiteFooter';
import Reveal from '../components/Reveal';
import { TRUST_ITEMS } from '../data/itemOptions';
import { getRecentProducts, getTrendingProducts } from '../services/mockData';
import { resolveAssetPath } from '../utils/assetPaths';

const heroMoments = [
  {
    label: 'Occasion edit',
    title: 'Women',
    copy: 'Statement pieces for dinners, celebrations, and sharper plans.',
    image: resolveAssetPath('/hero_banners/women_banner.jpg'),
    path: '/products?gender=Women',
    position: '82% 38%',
    contentSide: 'left',
  },
  {
    label: 'Tailored layers',
    title: 'Men',
    copy: 'Formalwear, jackets, and event-ready fits that stay effortless.',
    image: resolveAssetPath('/hero_banners/men_banner.jpg'),
    path: '/products?gender=Men',
    position: '18% 38%',
    contentSide: 'right',
  },
  {
    label: 'Shared wardrobe',
    title: 'Unisex',
    copy: 'Versatile essentials for repeat styling and flexible rental choices.',
    image: resolveAssetPath('/hero_banners/unisex_banner.jpg'),
    path: '/products?gender=Unisex',
    position: '76% 30%',
    contentSide: 'left',
  },
];

const promiseItems = [
  {
    index: '01',
    title: 'Style-first discovery',
    copy: 'Browse by occasion, category, and mood without losing the premium feel.',
  },
  {
    index: '02',
    title: 'Lender-ready tooling',
    copy: 'Pricing guidance, listing flows, and review support stay inside the same product language.',
  },
  {
    index: '03',
    title: 'Try-on direction',
    copy: 'Validated virtual try-on prototypes keep the roadmap grounded in something already working.',
  },
];

const experienceSteps = [
  {
    index: '01',
    title: 'Find the right mood fast',
    copy: 'Move from curated edits into the filtered catalog without getting buried in interface chrome.',
  },
  {
    index: '02',
    title: 'Inspect each piece with confidence',
    copy: 'Product detail, cart, and order touchpoints stay cleaner and more consistent from one route to the next.',
  },
  {
    index: '03',
    title: 'Keep the supply side polished',
    copy: 'Lenders get pricing support, moderation guidance, and a calmer workspace rather than a dashboard pile-up.',
  },
];

const platformNotes = [
  {
    label: 'For renters',
    title: 'Editorial browsing with less friction',
    copy: 'The catalog now relies on image hierarchy, quieter cards, and clearer product entry points rather than stacked controls.',
  },
  {
    label: 'For lenders',
    title: 'A real workspace instead of a generic admin surface',
    copy: 'Upload, review, and listing management screens are now tuned to the same premium language as the storefront.',
  },
  {
    label: 'For trust',
    title: 'The rules remain visible without feeling heavy',
    copy: 'Moderation states, hygiene signals, and verification cues still show up, but they stop overwhelming the product.',
  },
  {
    label: 'For scale',
    title: 'Cloud-ready try-on direction',
    copy: 'OOTDiffusion has already been validated separately, so the platform can move toward hosted try-on without pretending it is finished today.',
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const trendingProducts = useMemo(() => getTrendingProducts(6), []);
  const recentProducts = useMemo(() => getRecentProducts(6), []);
  const marqueeItems = useMemo(() => [...TRUST_ITEMS, ...TRUST_ITEMS], []);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % heroMoments.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const activeHero = heroMoments[activeHeroIndex];

  return (
    <div className="page-shell landing-page">
      <AppNavbar />

      <main>
        <section className="landing-hero">
          <div className="container-xxl px-3 px-lg-4">
            <div className="landing-hero__layout">
              <Reveal className="landing-hero__content" offset={28}>
                <p className="eyebrow landing-hero__eyebrow mb-3">Fashion rental, re-composed</p>
                <h1 className="landing-hero__title">
                  Wear the statement piece. Skip the one-time purchase.
                </h1>
                <p className="landing-hero__lede">
                  Rent a Fit brings sharper discovery, calmer browsing, and lender tooling that feels as considered as the wardrobe itself.
                </p>

                <div className="landing-hero__actions">
                  <button type="button" className="btn btn-primary rounded-pill px-4 px-lg-5" onClick={() => navigate('/products')}>
                    Explore the catalog
                  </button>
                  <button type="button" className="btn btn-outline-primary rounded-pill px-4 px-lg-5" onClick={() => navigate('/lender')}>
                    Open lender space
                  </button>
                </div>
              </Reveal>

              <Reveal className="landing-hero__visual" delay={120} offset={40}>
                <div
                  className={"hero-banner hero-banner--" + activeHero.contentSide}
                  style={{ '--hero-image': 'url(' + activeHero.image + ')', '--hero-position': activeHero.position }}
                >
                  <div className="hero-banner__content" key={activeHero.title}>
                    <p className="hero-banner__eyebrow mb-0">{activeHero.label}</p>
                    <h2 className="hero-banner__title">{activeHero.title}</h2>
                    <p className="hero-banner__copy mb-0">{activeHero.copy}</p>
                    <div className="hero-banner__actions">
                      <button
                        type="button"
                        className="btn btn-light rounded-pill px-4"
                        onClick={() => navigate(activeHero.path)}
                      >
                        Explore {activeHero.title}
                      </button>
                    </div>
                  </div>

                  <div className="hero-banner__indicators" aria-label="Hero slide controls">
                    {heroMoments.map((moment, index) => (
                      <button
                        key={moment.title}
                        type="button"
                        className={"hero-banner__indicator" + (index === activeHeroIndex ? ' is-active' : '')}
                        onClick={() => setActiveHeroIndex(index)}
                        aria-label={"Show " + moment.title + " banner"}
                        aria-pressed={index === activeHeroIndex}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal className="landing-hero__promise-list landing-hero__promise-list--grid" delay={160} offset={20}>
              {promiseItems.map((item) => (
                <div className="landing-hero__promise landing-hero__promise--card" key={item.index}>
                  <span className="landing-hero__promise-index">{item.index}</span>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.copy}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="trust-ticker" aria-label="Platform trust highlights">
          <div className="trust-ticker__track">
            {marqueeItems.map((item, index) => (
              <span className="trust-ticker__item" key={item + '-' + index}>{item}</span>
            ))}
          </div>
        </section>

        <section className="container-xxl px-3 px-lg-4 py-4">
          <Reveal className="section-heading section-heading--stacked" as="div">
            <p className="eyebrow mb-0">How the experience moves</p>
            <h2 className="section-title mb-0">A calmer fashion journey for both sides of the marketplace.</h2>
            <p className="section-subtitle mb-0">
              The product now leans on stronger imagery, fewer competing controls, and cleaner motion so the core idea feels premium instead of improvised.
            </p>
          </Reveal>

          <div className="experience-grid">
            {experienceSteps.map((step, index) => (
              <Reveal className="experience-step" key={step.index} delay={index * 100}>
                <span className="experience-step__index">{step.index}</span>
                <h3 className="experience-step__title">{step.title}</h3>
                <p className="experience-step__copy mb-0">{step.copy}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="collections" className="container-xxl py-3 px-3 px-lg-4">
          <ProductRail
            eyebrow="Trending edit"
            title="Pieces renters are gravitating toward right now"
            subtitle="The catalog cards stay minimal now, so the products carry the section instead of fighting extra buttons."
            products={trendingProducts}
          />
        </section>

        <section className="container-xxl py-4 px-3 px-lg-4">
          <Reveal className="section-heading section-heading--stacked" as="div" offset={32}>
            <p className="eyebrow mb-0">Why it feels sharper now</p>
            <h2 className="section-title mb-0">The interface reads more like a fashion product and less like a stitched-together demo.</h2>
            <p className="section-subtitle mb-0">
              The strongest changes are not extra widgets. They are better composition, clearer product hierarchy, and more disciplined renter and lender touchpoints.
            </p>
          </Reveal>

          <div className="editorial-note-grid editorial-note-grid--balanced editorial-note-grid--landing">
            {platformNotes.map((note, index) => (
              <Reveal className="editorial-note" key={note.title} delay={index * 90}>
                <p className="eyebrow mb-2">{note.label}</p>
                <h3 className="detail-title mb-2">{note.title}</h3>
                <p className="mb-0">{note.copy}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container-xxl py-3 px-3 px-lg-4">
          <ProductRail
            eyebrow="Fresh arrivals"
            title="Recently uploaded listings that keep the catalog moving"
            subtitle="Newer arrivals inherit the same quieter product card system and cleaner scroll rhythm."
            products={recentProducts}
          />
        </section>

        <section className="container-xxl py-5 px-3 px-lg-4">
          <Reveal className="landing-cta" as="div" offset={28}>
            <div>
              <p className="eyebrow text-white-50 mb-2">Ready to keep building</p>
              <h2 className="section-title text-white mb-2">Browse the live catalog, open lender space, or keep refining the full product around this cleaner language.</h2>
              <p className="mb-0 landing-cta__copy">
                The storefront, auth, and lender routes now feel far closer to one product instead of disconnected screens.
              </p>
            </div>

            <div className="landing-cta__actions">
              <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => navigate('/products')}>
                Start renting
              </button>
              <button type="button" className="btn btn-outline-light rounded-pill px-4" onClick={() => navigate('/faq')}>
                Read the FAQ
              </button>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default LandingPage;
