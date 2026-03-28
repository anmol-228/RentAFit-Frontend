import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import Reveal from '../../components/Reveal';

const businessPillars = [
  {
    number: '01',
    title: 'Rent instead of accumulate',
    copy: 'Rent a Fit is built around access to better clothing without forcing ownership for every event, dinner, wedding, or formal plan.',
  },
  {
    number: '02',
    title: 'Keep trust visible',
    copy: 'Pricing support, review logic, and quality cues stay inside the product so the platform feels safer without becoming heavy.',
  },
  {
    number: '03',
    title: 'Make lender work calmer',
    copy: 'Upload, pricing, moderation, and listing management are treated like part of the same experience, not an afterthought.',
  },
];

const operatingNotes = [
  {
    label: 'Pricing support',
    copy: 'Model-driven pricing helps translate garment age, condition, and original value into a realistic rental band.',
  },
  {
    label: 'Moderation path',
    copy: 'Approve, review, and reject states exist to protect catalog quality before renters ever see a listing.',
  },
  {
    label: 'Recommendation layer',
    copy: 'Item-to-item suggestions help renters move through the wardrobe faster instead of browsing everything from scratch.',
  },
  {
    label: 'Virtual try-on direction',
    copy: 'OOTDiffusion has already been validated separately, giving the platform a real path toward cloud-backed experimentation later.',
  },
];

const principles = [
  {
    title: 'Fashion first',
    copy: 'The interface should still feel like a clothing product, not a stitched admin system with a storefront stuck on top.',
  },
  {
    title: 'Circulation over clutter',
    copy: 'The business works best when garments move between closets instead of sitting idle after one-time use.',
  },
  {
    title: 'Calm operational design',
    copy: 'The supply side should stay understandable for lenders without hiding the rules that keep the marketplace healthy.',
  },
];

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell about-page">
      <AppNavbar />

      <main>
        <section className="container-xxl px-3 px-lg-4 py-4 py-lg-5">
          <Reveal className="section-shell about-hero" as="div" offset={28}>
            <div className="about-hero__intro">
              <p className="eyebrow mb-2">About Rent a Fit</p>
              <h1 className="section-title mb-3 about-hero__title">A wardrobe system for access, trust, and repeat use.</h1>
              <p className="section-subtitle mb-0 about-hero__copy">
                Rent a Fit is not just a rental catalog. It is a fashion marketplace designed to make better dressing more accessible, keep lender participation practical, and support the business with pricing and moderation logic that already works in the background.
              </p>

              <div className="about-hero__actions mt-4">
                <button type="button" className="btn btn-primary rounded-pill px-4" onClick={() => navigate('/products')}>
                  Browse the catalog
                </button>
                <button type="button" className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/lender')}>
                  Open lender space
                </button>
              </div>
            </div>

            <div className="about-hero__quote-wrap">
              <div className="about-hero__quote">
                <p className="eyebrow mb-2">The idea in one line</p>
                <p className="about-hero__quote-text mb-0">Make premium dressing feel lighter by turning one-time purchases into repeat circulation.</p>
              </div>
              <div className="about-hero__mini-grid">
                <div className="about-mini-card">
                  <span>For renters</span>
                  <strong>Cleaner discovery, less friction, better outfit access.</strong>
                </div>
                <div className="about-mini-card">
                  <span>For lenders</span>
                  <strong>Pricing help, review guidance, and a calmer listing workflow.</strong>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="container-xxl px-3 px-lg-4 py-2 py-lg-3">
          <Reveal className="section-heading section-heading--stacked" as="div" offset={24}>
            <p className="eyebrow mb-0">What the business is built around</p>
            <h2 className="section-title mb-0">Three ideas shape the whole platform.</h2>
            <p className="section-subtitle mb-0">
              The product becomes easier to understand when the business logic is visible: access over accumulation, trust without heavy UX, and tooling that respects the lender side too.
            </p>
          </Reveal>

          <div className="about-rhythm">
            <div className="about-rhythm__line" aria-hidden="true" />
            {businessPillars.map((pillar, index) => (
              <Reveal className="about-rhythm__step" key={pillar.title} delay={index * 100}>
                <span className="about-rhythm__number">{pillar.number}</span>
                <div className="about-rhythm__card">
                  <h3 className="detail-title mb-2">{pillar.title}</h3>
                  <p className="mb-0">{pillar.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container-xxl px-3 px-lg-4 py-4">
          <Reveal className="section-heading section-heading--stacked" as="div" offset={24}>
            <p className="eyebrow mb-0">How the product already operates</p>
            <h2 className="section-title mb-0">The platform already has working structure behind the storefront.</h2>
            <p className="section-subtitle mb-0">
              The core vision is supported by ML-backed pricing, moderation logic, recommendation flow, and a try-on direction that has already been validated separately.
            </p>
          </Reveal>

          <div className="about-operating-grid">
            {operatingNotes.map((note, index) => (
              <Reveal className="about-operating-card" key={note.label} delay={index * 85}>
                <p className="eyebrow mb-2">{note.label}</p>
                <p className="mb-0">{note.copy}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container-xxl px-3 px-lg-4 py-2 pb-5">
          <Reveal className="about-manifest" as="div" offset={28}>
            <div className="about-manifest__copy">
              <p className="eyebrow mb-2">What should stay true</p>
              <h2 className="section-title mb-3">Rent a Fit should feel like a fashion product with real operational depth, not a marketplace demo wearing nice clothes.</h2>
            </div>

            <div className="about-principles-grid">
              {principles.map((principle, index) => (
                <Reveal className="experience-step about-principle" key={principle.title} delay={index * 90}>
                  <h3 className="experience-step__title">{principle.title}</h3>
                  <p className="experience-step__copy mb-0">{principle.copy}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default AboutPage;
