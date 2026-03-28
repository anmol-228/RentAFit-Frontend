import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import {
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  GENDER_OPTIONS,
  MATERIAL_OPTIONS,
  SIZE_OPTIONS,
} from '../../data/itemOptions';
import { predictListingDecision, predictRentalPrice } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const INITIAL_FORM_STATE = {
  productName: '',
  brand: '',
  category: '',
  gender: '',
  size: '',
  material: '',
  condition: '',
  age: '',
  originalPrice: '',
  providerPrice: '',
  description: '',
};

const IMAGE_FIELDS = [
  {
    key: 'frontImage',
    label: 'Clean front view',
    note: 'Upload the full garment from the front against a simple background.',
  },
  {
    key: 'closeupImage',
    label: 'Close-up detail',
    note: 'Show texture, stitching, buttons, embroidery, or any important surface detail.',
  },
];

const INITIAL_PREVIEWS = { frontImage: '', closeupImage: '' };

function UploadItemPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [previews, setPreviews] = useState(INITIAL_PREVIEWS);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const previewUrlsRef = useRef(INITIAL_PREVIEWS);

  useEffect(() => {
    previewUrlsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      Object.values(previewUrlsRef.current).forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (fieldName, file) => {
    setApiError('');
    if (!file) return;
    setPreviews((prev) => {
      if (prev[fieldName]) URL.revokeObjectURL(prev[fieldName]);
      return { ...prev, [fieldName]: URL.createObjectURL(file) };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const missingImages = IMAGE_FIELDS.filter((item) => !previews[item.key]);

    if (!form.checkValidity() || missingImages.length > 0) {
      event.stopPropagation();
      setValidated(true);
      if (missingImages.length > 0) {
        setApiError('Upload both required garment photos: one clean front view and one close-up detail shot.');
      }
      return;
    }

    setValidated(true);
    setIsSubmitting(true);
    setApiError('');

    const ageMonths = Number(formData.age);
    const originalPrice = Number(formData.originalPrice);
    const providerPrice = Number(formData.providerPrice);

    const modelAPayload = {
      brand: formData.brand,
      category: formData.category,
      material: formData.material,
      size: formData.size,
      condition: formData.condition,
      age_months: ageMonths,
      original_price: originalPrice,
    };

    const modelBPayload = {
      brand: formData.brand,
      category: formData.category,
      gender: formData.gender,
      material: formData.material,
      size: formData.size,
      condition: formData.condition,
      garment_age_months: ageMonths,
      original_price: originalPrice,
      provider_price: providerPrice,
      listing_created_at: new Date().toISOString().slice(0, 10),
      as_of_date: new Date().toISOString().slice(0, 10),
      current_status: 'PENDING_REVIEW',
    };

    try {
      const [priceData, decisionData] = await Promise.all([
        predictRentalPrice(modelAPayload),
        predictListingDecision(modelBPayload),
      ]);

      const payload = {
        ...formData,
        age: ageMonths,
        originalPrice,
        providerPrice,
        previews,
      };

      sessionStorage.setItem('latestItemDraft', JSON.stringify(payload));
      sessionStorage.setItem('predictedRange', JSON.stringify(priceData.final_price_range));
      sessionStorage.setItem('predictedMid', JSON.stringify(priceData.predicted_price_mid));
      sessionStorage.setItem('modelBDecision', JSON.stringify(decisionData));

      navigate('/lender/price', {
        state: {
          itemDetails: payload,
          predictedRange: priceData.final_price_range,
          predictedMid: priceData.predicted_price_mid,
          modelBDecision: decisionData,
        },
      });
    } catch (error) {
      setApiError(error?.response?.data?.detail || error?.message || 'Unable to process the listing right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const draftSummary = [
    ['Product', formData.productName || 'Not set'],
    ['Brand', formData.brand || 'Not set'],
    ['Category', formData.category || 'Not set'],
    ['Condition', formData.condition || 'Not set'],
    ['Image set', 'Front view + close-up'],
    ['Desired price', formData.providerPrice ? formatCurrency(Number(formData.providerPrice)) : 'Not set'],
  ];

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="container-xxl workspace-shell py-5 px-3 px-lg-4">
        <section className="workspace-header">
          <div>
            <p className="eyebrow mb-2">Lender flow</p>
            <h1 className="section-title mb-2">Upload a product</h1>
            <p className="text-muted mb-0">This flow now expects exactly two garment photos: one clean front view and one close-up detail shot, followed by the listing metadata and ML guidance.</p>
          </div>
          <div className="workspace-header__actions">
            <button type="button" className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/lender/dashboard')}>
              Back to dashboard
            </button>
          </div>
        </section>

        {apiError && <div className="alert alert-danger rounded-4 border-0 shadow-sm">{apiError}</div>}

        <form className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleSubmit}>
          <div className="upload-workspace">
            <div className="workspace-card upload-workspace__main">
              <section className="workspace-section">
                <div className="workspace-card__header">
                  <div>
                    <p className="eyebrow mb-1">Image set</p>
                    <h2 className="h4 mb-0">Upload the two required garment photos</h2>
                  </div>
                </div>

                <div className="upload-preview-grid upload-preview-grid--two">
                  {IMAGE_FIELDS.map((item) => (
                    <div className="upload-preview-card" key={item.key}>
                      <label className="form-label">{item.label}</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(event) => handleImageChange(item.key, event.target.files?.[0])}
                      />
                      <span className="upload-preview-card__note">{item.note}</span>
                      <div className="upload-preview-card__frame mt-3">
                        {previews[item.key] ? (
                          <img src={previews[item.key]} alt={`${item.label} preview`} className="upload-preview-card__img" />
                        ) : (
                          <span className="upload-preview-card__empty">No preview yet</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="workspace-section">
                <div className="workspace-card__header">
                  <div>
                    <p className="eyebrow mb-1">Listing metadata</p>
                    <h2 className="h4 mb-0">Describe the piece clearly</h2>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Product name</label>
                    <input className="form-control form-control-lg" name="productName" value={formData.productName} onChange={handleChange} placeholder="e.g. Midnight Cocktail Dress" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Brand</label>
                    <select className="form-select form-select-lg" name="brand" value={formData.brand} onChange={handleChange} required>
                      <option value="">Select brand</option>
                      {BRAND_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <select className="form-select form-select-lg" name="category" value={formData.category} onChange={handleChange} required>
                      <option value="">Select category</option>
                      {CATEGORY_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Gender</label>
                    <select className="form-select form-select-lg" name="gender" value={formData.gender} onChange={handleChange} required>
                      <option value="">Select gender</option>
                      {GENDER_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Size</label>
                    <select className="form-select form-select-lg" name="size" value={formData.size} onChange={handleChange} required>
                      <option value="">Select size</option>
                      {SIZE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Material</label>
                    <select className="form-select form-select-lg" name="material" value={formData.material} onChange={handleChange} required>
                      <option value="">Select material</option>
                      {MATERIAL_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Condition</label>
                    <select className="form-select form-select-lg" name="condition" value={formData.condition} onChange={handleChange} required>
                      <option value="">Select condition</option>
                      {CONDITION_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Age (months)</label>
                    <input type="number" min="0" className="form-control form-control-lg" name="age" value={formData.age} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Original price</label>
                    <input type="number" min="0" className="form-control form-control-lg" name="originalPrice" value={formData.originalPrice} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Desired rental price</label>
                    <input type="number" min="0" className="form-control form-control-lg" name="providerPrice" value={formData.providerPrice} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Description</label>
                    <textarea className="form-control form-control-lg" rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Describe the outfit, styling use case, and important details." required />
                  </div>
                </div>
              </section>

              <section className="workspace-section">
                <div className="d-flex flex-wrap gap-3">
                  <button type="submit" className="btn btn-primary btn-lg rounded-pill px-4" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Get pricing and review result'}
                  </button>
                  <button type="button" className="btn btn-outline-primary btn-lg rounded-pill px-4" onClick={() => navigate('/lender/dashboard')}>
                    Back to dashboard
                  </button>
                </div>
              </section>
            </div>

            <aside className="workspace-card upload-workspace__aside">
              <p className="eyebrow mb-2">Submission notes</p>
              <h2 className="h4 mb-3">What the models will use</h2>
              <ul className="rules-list mb-4">
                <li>Upload exactly two photos: one clean front view and one close-up detail image.</li>
                <li>Model A uses brand, category, material, size, condition, age, and original price.</li>
                <li>Model B adds gender, desired rental price, and listing lifecycle context.</li>
                <li>The close-up image helps communicate texture, finish, embroidery, buttons, and quality cues.</li>
              </ul>

              <div className="draft-summary">
                {draftSummary.map(([label, value]) => (
                  <div className="draft-summary__row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

export default UploadItemPage;
