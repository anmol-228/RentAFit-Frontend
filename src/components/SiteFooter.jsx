import { Link } from 'react-router-dom';
import Reveal from './Reveal';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'All products', path: '/products' },
      { label: 'Shirts', path: '/products?category=Shirt' },
      { label: 'Jackets', path: '/products?category=Jacket' },
      { label: 'Sarees', path: '/products?category=Saree' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'FAQ', path: '/faq' },
      { label: 'Orders', path: '/orders' },
      { label: 'Cart', path: '/cart' },
      { label: 'Lender Space', path: '/lender/dashboard' },
    ],
  },
];

function SiteFooter() {
  return (
    <footer className="site-footer mt-5">
      <div className="container-xxl px-3 px-lg-4 py-5">
        <Reveal className="site-footer__shell" as="div">
          <div className="row g-4 g-xl-5 align-items-start">
            <div className="col-xl-5">
              <p className="eyebrow text-white-50 mb-3">Fashion rental, sharpened</p>
              <p className="site-footer__brand mb-3">Rent a Fit</p>
              <p className="site-footer__copy mb-4">
                Premium outfit rentals with polished discovery, lender-friendly tools, and a wardrobe rhythm that feels lighter from the very first browse.
              </p>
              <div className="site-footer__cta">
                <Link to="/products" className="btn btn-light rounded-pill px-4">
                  Browse the catalog
                </Link>
                <Link to="/lender" className="site-footer__text-link">
                  Open lender space
                </Link>
              </div>
            </div>

            {footerGroups.map((group) => (
              <div className="col-sm-6 col-xl-2" key={group.title}>
                <p className="site-footer__heading">{group.title}</p>
                <div className="d-grid gap-2">
                  {group.links.map((link) => (
                    <Link key={link.label} to={link.path} className="site-footer__link">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="col-xl-3">
              <p className="site-footer__heading">What stays built in</p>
              <p className="site-footer__copy mb-0">
                Hygiene checks, reviewed listings, transparent pricing guidance, and a try-on path that is ready for cloud-backed refinement.
              </p>
            </div>
          </div>

          <div className="site-footer__bottom">
            <span>Built for repeat wear, lighter wardrobes, and better-looking rental flows.</span>
            <span>Rent a Fit</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

export default SiteFooter;
