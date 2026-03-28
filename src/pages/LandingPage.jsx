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

const supportItems = [
  {
    title: 'Curated discovery',
    copy: 'Browse sharper edits instead of getting lost in a giant catalog.',
  },
  {
    title: 'Reviewed listings',
    copy: 'Pricing guidance and moderation stay built into the platform.',
  },
  {
    title: 'Lender-ready flow',
    copy: 'Upload, price, and publish from one calmer workspace.',
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
                  Rent standout pieces for the moments that need them, then return them without building a closet full of one-time buys.
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

            <Reveal className="landing-support-strip" delay={160} offset={20}>
              {supportItems.map((item) => (
                <div className="landing-support-card" key={item.title}>
                  <h2>{item.title}</h2>
                  <p className="mb-0">{item.copy}</p>
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

        <section id="collections" className="container-xxl py-3 px-3 px-lg-4">
          <ProductRail
            eyebrow="Trending edit"
            title="Pieces renters are gravitating toward right now"
            subtitle="Smaller product cards, cleaner rails, and quicker entry into each listing."
            products={trendingProducts}
          />
        </section>

        <section className="container-xxl py-3 px-3 px-lg-4">
          <ProductRail
            eyebrow="Fresh arrivals"
            title="Recently uploaded listings that keep the catalog moving"
            subtitle="New arrivals inherit the same calmer product language so browsing still feels light on mobile and desktop."
            products={recentProducts}
          />
        </section>

        <section className="container-xxl py-5 px-3 px-lg-4">
          <Reveal className="landing-cta" as="div" offset={28}>
            <div>
              <p className="eyebrow text-white-50 mb-2">Need the full picture?</p>
              <h2 className="section-title text-white mb-2">Read how Rent a Fit works for renters, lenders, and the business behind the platform.</h2>
              <p className="mb-0 landing-cta__copy">
                The homepage now stays focused on discovery. The fuller story lives in one place when people actually want it.
              </p>
            </div>

            <div className="landing-cta__actions">
              <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => navigate('/products')}>
                Start renting
              </button>
              <button type="button" className="btn btn-outline-light rounded-pill px-4" onClick={() => navigate('/about')}>
                About Rent a Fit
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
