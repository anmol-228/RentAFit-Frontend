import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";
import { MOCK_FAQ } from "../../services/mockData";

function FaqPage() {
  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="container py-5">
        <div className="faq-header mb-4">
          <p className="eyebrow mb-2">Help center</p>
          {/* <h1 className="section-title mb-2">Frequently asked questions</h1> */}
          {/* <p className="text-muted mb-0"></p> */}
        </div>

        <div
          className="accordion accordion-flush faq-accordion"
          id="faqAccordion"
        >
          {MOCK_FAQ.map((item, index) => (
            <div className="accordion-item" key={item.question}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${index === 0 ? "" : "collapsed"}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq-${index}`}
                  aria-expanded={index === 0 ? "true" : "false"}
                  aria-controls={`faq-${index}`}
                >
                  {item.question}
                </button>
              </h2>
              <div
                id={`faq-${index}`}
                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default FaqPage;
