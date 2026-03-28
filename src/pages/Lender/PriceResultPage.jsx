import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import { saveLenderListing } from '../../services/mockData';
import { formatCurrency } from '../../utils/formatters';

function decisionTone(decision) {
  if (decision === 'Approve') return 'status-pill status-pill--success';
  if (decision === 'Review') return 'status-pill status-pill--warning';
  return 'status-pill status-pill--danger';
}

function decisionCopy(decision) {
  if (decision === 'Approve') return 'Ready to move forward with a live listing.';
  if (decision === 'Review') return 'Keep the listing visible to ops before it goes live.';
  return 'Hold this upload until the moderation issues are resolved.';
}

function PriceResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const predictedRange = useMemo(() => {
    if (location.state?.predictedRange) return location.state.predictedRange;
    const stored = sessionStorage.getItem('predictedRange');
    return stored ? JSON.parse(stored) : null;
  }, [location.state]);

  const predictedMid = useMemo(() => {
    if (location.state?.predictedMid) return location.state.predictedMid;
    const stored = sessionStorage.getItem('predictedMid');
    return stored ? JSON.parse(stored) : null;
  }, [location.state]);

  const modelBDecision = useMemo(() => {
    if (location.state?.modelBDecision) return location.state.modelBDecision;
    const stored = sessionStorage.getItem('modelBDecision');
    return stored ? JSON.parse(stored) : null;
  }, [location.state]);

  const itemDetails = useMemo(() => {
    if (location.state?.itemDetails) return location.state.itemDetails;
    const stored = sessionStorage.getItem('latestItemDraft');
    return stored ? JSON.parse(stored) : null;
  }, [location.state]);

  const initialPrice = itemDetails?.providerPrice || predictedMid || predictedRange?.min_price || 0;
  const [selectedPrice, setSelectedPrice] = useState(initialPrice);

  if (predictedRange == null || itemDetails == null) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="container py-5">
          <div className="empty-view">
            <h2 className="mb-2">No result available.</h2>
            <button type="button" className="btn btn-primary rounded-pill" onClick={() => navigate('/lender/upload')}>
              Back to upload
            </button>
          </div>
        </main>
      </div>
    );
  }

  const minPrice = Number(predictedRange.min_price);
  const maxPrice = Number(predictedRange.max_price);
  const publishPrice = Number(selectedPrice) || 0;
  const priceInsideRange = publishPrice >= minPrice && publishPrice <= maxPrice;
  const frontImageUrl = itemDetails.previews?.frontImage || itemDetails.mainImageUrl || '';
  const closeupImageUrl = itemDetails.previews?.closeupImage || itemDetails.imageUrls?.[1] || '';
  const listingImages = [frontImageUrl, closeupImageUrl].filter(Boolean);
  const decision = modelBDecision.prediction?.predicted_decision || 'Review';

  const imageSet = [
    {
      key: 'front',
      eyebrow: 'Primary listing image',
      label: 'Clean front view',
      note: 'Used as the listing cover image across catalog, search, and product cards.',
      imageUrl: frontImageUrl,
    },
    {
      key: 'closeup',
      eyebrow: 'Secondary detail image',
      label: 'Close-up detail',
      note: 'Used as the second product view to show fabric, finish, and garment details.',
      imageUrl: closeupImageUrl,
    },
  ];

  const publishListing = () => {
    if (priceInsideRange === false) return;

    saveLenderListing({
      id: `lender-${Date.now()}`,
      name: itemDetails.productName,
      brand: itemDetails.brand,
      category: itemDetails.category,
      gender: itemDetails.gender,
      material: itemDetails.material,
      condition: itemDetails.condition,
      size: itemDetails.size,
      availableSizes: [itemDetails.size],
      price: publishPrice,
      providerPrice: publishPrice,
      originalPrice: Number(itemDetails.originalPrice),
      rating: 4.6,
      styleTag: 'New lender upload',
      badge: modelBDecision.prediction?.predicted_decision || 'Review',
      recent: true,
      trending: false,
      featured: false,
      shortDescription: itemDetails.description,
      description: itemDetails.description,
      trustNotes: ['Submitted with front-view + close-up image set', 'Pending operational review', 'Frontend demo listing'],
      status: modelBDecision.prediction?.suggested_listing_status || 'PENDING_REVIEW',
      decisionLabel: modelBDecision.prediction?.predicted_decision || 'Review',
      createdAt: new Date().toISOString().slice(0, 10),
      mainImageUrl: frontImageUrl,
      imageUrls: listingImages,
    });

    navigate('/lender/dashboard', { state: { listed: true } });
  };

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="container-xxl workspace-shell py-5 px-3 px-lg-4">
        <section className="workspace-card result-stage mb-4">
          <div className="result-stage__copy">
            <p className="eyebrow mb-2">Listing result</p>
            <h1 className="section-title mb-3">Your lender result now reads like a publish-ready product review.</h1>
            <p className="text-muted mb-0">
              Model A sets the pricing window, Model B gives the moderation route, and the front-view + close-up image set is already mapped into the saved listing preview.
            </p>
            <div className="result-stage__chips">
              <div className="result-chip">
                <span>Selected price</span>
                <strong>{formatCurrency(publishPrice || predictedMid)}</strong>
              </div>
              <div className="result-chip">
                <span>Moderation route</span>
                <strong>{decision}</strong>
              </div>
              <div className="result-chip">
                <span>Image set</span>
                <strong>Front view + close-up</strong>
              </div>
            </div>
          </div>

          <div className="result-stage__visual">
            <div className="result-stage__primary-frame">
              {frontImageUrl ? (
                <img src={frontImageUrl} alt="Primary listing preview" className="result-stage__primary-img" />
              ) : (
                <div className="upload-preview-card__empty">Front image not added</div>
              )}
            </div>
            <div className="result-stage__detail-card">
              <div className="result-stage__detail-frame">
                {closeupImageUrl ? (
                  <img src={closeupImageUrl} alt="Close-up preview" className="result-stage__detail-img" />
                ) : (
                  <div className="upload-preview-card__empty">Close-up not added</div>
                )}
              </div>
              <div className="result-stage__detail-copy">
                <span>Saved preview roles</span>
                <strong>Front view cover + close-up detail</strong>
                <p>{decisionCopy(decision)}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="lender-result-layout">
          <div className="lender-result-layout__main">
            <div className="workspace-grid mb-4">
              <section className="workspace-card">
                <div className="workspace-card__header">
                  <div>
                    <p className="eyebrow mb-1">Model A</p>
                    <h2 className="h4 mb-0">Suggested rental range</h2>
                  </div>
                </div>
                <div className="result-stat-grid">
                  <div className="result-stat"><span>Min price</span><strong>{formatCurrency(minPrice)}</strong></div>
                  <div className="result-stat"><span>Max price</span><strong>{formatCurrency(maxPrice)}</strong></div>
                  <div className="result-stat"><span>Mid estimate</span><strong>{formatCurrency(predictedMid)}</strong></div>
                  <div className="result-stat"><span>Source</span><strong>{predictedRange.source}</strong></div>
                </div>
              </section>

              <section className="workspace-card">
                <div className="workspace-card__header">
                  <div>
                    <p className="eyebrow mb-1">Model B</p>
                    <h2 className="h4 mb-0">Moderation guidance</h2>
                  </div>
                </div>
                <div className="result-stat-grid">
                  <div className="result-stat"><span>Decision</span><strong>{decision}</strong></div>
                  <div className="result-stat"><span>Suggested status</span><strong>{modelBDecision.prediction?.suggested_listing_status}</strong></div>
                  <div className="result-stat"><span>Review required</span><strong>{String(modelBDecision.lifecycle?.review_required)}</strong></div>
                  <div className="result-stat"><span>Visible to renters</span><strong>{modelBDecision.lifecycle?.visible_to_renters ? 'Yes' : 'No'}</strong></div>
                </div>

                {modelBDecision.lifecycle?.frontend_popup_recommended ? (
                  <div className="alert alert-warning rounded-4 border-0 mb-0 mt-3">
                    <strong>Conflict popup:</strong> {modelBDecision.lifecycle.frontend_popup_message}
                  </div>
                ) : null}
              </section>
            </div>

            <section className="workspace-card mb-4">
              <div className="workspace-card__header">
                <div>
                  <p className="eyebrow mb-1">Submitted details</p>
                  <h2 className="h4 mb-0">Listing summary</h2>
                </div>
              </div>
              <div className="result-stat-grid result-stat-grid--summary">
                <div className="result-stat"><span>Name</span><strong>{itemDetails.productName}</strong></div>
                <div className="result-stat"><span>Brand</span><strong>{itemDetails.brand}</strong></div>
                <div className="result-stat"><span>Category</span><strong>{itemDetails.category}</strong></div>
                <div className="result-stat"><span>Gender</span><strong>{itemDetails.gender}</strong></div>
                <div className="result-stat"><span>Size</span><strong>{itemDetails.size}</strong></div>
                <div className="result-stat"><span>Material</span><strong>{itemDetails.material}</strong></div>
              </div>
            </section>

            <section className="workspace-card">
              <div className="workspace-card__header workspace-card__header--stacked">
                <div>
                  <p className="eyebrow mb-1">Saved listing preview</p>
                  <h2 className="h4 mb-0">Primary and detail image roles</h2>
                </div>
              </div>
              <div className="result-image-preview">
                {imageSet.map((image) => (
                  <article key={image.key} className="result-image-card">
                    <div className="result-image-card__frame">
                      {image.imageUrl ? (
                        <img src={image.imageUrl} alt={image.label} className="result-image-card__img" />
                      ) : (
                        <div className="upload-preview-card__empty">Image not added</div>
                      )}
                    </div>
                    <div className="result-image-card__meta">
                      <span>{image.eyebrow}</span>
                      <strong>{image.label}</strong>
                      <p>{image.note}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="workspace-card result-publish-card">
            <div className="workspace-card__header workspace-card__header--stacked">
              <div>
                <p className="eyebrow mb-1">Final selection</p>
                <h2 className="h4 mb-0">Choose your publish price</h2>
              </div>
            </div>
            <p className="text-muted">Keep the chosen price inside the ML range so the listing remains aligned with the platform guidance.</p>
            <label className="form-label mt-2">Publish price</label>
            <input
              type="number"
              className="form-control form-control-lg"
              min={minPrice}
              max={maxPrice}
              value={selectedPrice}
              onChange={(event) => setSelectedPrice(event.target.value)}
            />
            <div className="form-text">Allowed range: {formatCurrency(minPrice)} to {formatCurrency(maxPrice)}</div>

            <div className="result-publish-card__summary">
              <div className="result-publish-card__row">
                <span>Chosen final price</span>
                <strong>{formatCurrency(publishPrice || 0)}</strong>
              </div>
              <div className="result-publish-card__row">
                <span>Moderation route</span>
                <strong>{decision}</strong>
              </div>
              <div className="result-publish-card__row">
                <span>Image structure</span>
                <strong>Front view + close-up</strong>
              </div>
              <div className="result-publish-card__row">
                <span>Saved renter preview</span>
                <strong>{listingImages.length}/2 images ready</strong>
              </div>
            </div>

            <div className="result-note mt-4">
              <strong>Saved listing preview:</strong> The clean front view becomes the cover image renters see first, while the close-up remains as the second detail view on the product page.
            </div>

            {priceInsideRange === false ? (
              <div className="alert alert-warning rounded-4 border-0 mt-4 mb-0">
                Keep the selected price inside the suggested range before publishing.
              </div>
            ) : null}

            <div className="result-publish-card__actions">
              <button type="button" className="btn btn-primary rounded-pill px-4" onClick={publishListing} disabled={priceInsideRange === false}>
                Publish listing
              </button>
              <button type="button" className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate('/lender/upload')}>
                Edit details
              </button>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default PriceResultPage;
