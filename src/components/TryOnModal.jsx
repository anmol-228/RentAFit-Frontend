function TryOnModal({ product, triggerClassName = "" }) {
  const modalId = `tryon-${product.id}`;

  return (
    <>
      <button
        type="button"
        className={`btn product-card__action product-card__action--dark ${triggerClassName}`.trim()}
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        Try On
      </button>

      <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 overflow-hidden">
            <div className="modal-header border-0 pb-0">
              <div>
                <p className="eyebrow mb-1">Style Preview</p>
                <h5 className="modal-title">{product.name}</h5>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body pt-3">
              <div className="row g-4 align-items-stretch">
                <div className="col-md-7">
                  <div className="tryon-stage h-100">
                    <div className="tryon-stage__placeholder">
                      <span className="tryon-stage__title">Preview workspace</span>
                      <p className="mb-0 text-muted">
                        Upload a photo and add your fit details to prepare a styling preview for this outfit.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="d-grid gap-3">
                    <div>
                      <label className="form-label">Upload your photo</label>
                      <input className="form-control" type="file" accept="image/*" />
                    </div>
                    <div>
                      <label className="form-label">Height</label>
                      <input className="form-control" type="text" placeholder="e.g. 5 ft 7 in" />
                    </div>
                    <div>
                      <label className="form-label">Preferred fit note</label>
                      <input className="form-control" type="text" placeholder="Slim, relaxed, classic..." />
                    </div>
                    <button type="button" className="btn btn-primary rounded-pill">
                      Open Preview Setup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TryOnModal;
