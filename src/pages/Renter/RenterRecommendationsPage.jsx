import { useEffect, useMemo, useState } from "react";
import AppNavbar from "../../components/AppNavbar";
import { fetchModelCSamples, recommendItems } from "../../services/api";

function RenterRecommendationsPage() {
  const [mode, setMode] = useState("seed");
  const [seedItemId, setSeedItemId] = useState("");
  const [likedItemIds, setLikedItemIds] = useState("");
  const [topK, setTopK] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [results, setResults] = useState(null);
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    fetchModelCSamples()
      .then((data) => setSamples(data.items || []))
      .catch(() => setSamples([]));
  }, []);

  const sampleOptions = useMemo(
    () =>
      samples.map((item) => ({
        value: item.listing_id,
        label: `${item.listing_id} - ${item.category} (${item.brand})`,
      })),
    [samples],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");
    setIsLoading(true);

    const payload = {
      top_k: Number(topK),
    };

    if (mode === "seed") {
      payload.seed_item_id = seedItemId;
    } else {
      payload.liked_item_ids = likedItemIds
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }

    try {
      const data = await recommendItems(payload);
      setResults(data);
    } catch (error) {
      setApiError(
        error?.response?.data?.detail ||
          error?.message ||
          "Unable to fetch recommendations.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lender-shell min-vh-100">
      <AppNavbar />

      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Renter Recommendations (Model C)</h2>
            <p className="text-muted mb-0">
              Generate item recommendations using the content-based baseline.
            </p>
          </div>
        </div>

        {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}

        <form
          className="card border-0 shadow-sm rounded-4 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="card-body p-4">
            <div className="d-flex gap-3 mb-3">
              <button
                type="button"
                className={`btn ${mode === "seed" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setMode("seed")}
              >
                View similar items
              </button>
              <button
                type="button"
                className={`btn ${mode === "liked" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setMode("liked")}
              >
                Profile's liked items
              </button>
            </div>

            {mode === "seed" ? (
              <div className="mb-3">
                <label className="form-label fw-medium">Seed Item ID</label>
                <select
                  className="form-select"
                  value={seedItemId}
                  onChange={(event) => setSeedItemId(event.target.value)}
                  required
                >
                  <option value="">Select a listing ID</option>
                  {sampleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="form-text">
                  Use sample IDs from the catalog.
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <label className="form-label fw-medium">
                  Liked Item IDs (comma separated)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="L0008,L0010,L0012"
                  value={likedItemIds}
                  onChange={(event) => setLikedItemIds(event.target.value)}
                  required
                />
                <div className="form-text">
                  You can copy from the sample list above.
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-medium">Top K</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max="20"
                value={topK}
                onChange={(event) => setTopK(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? "Fetching..." : "Get Recommendations"}
            </button>
          </div>
        </form>

        {results && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">Recommendations</h5>
              <div className="row g-3">
                {(results.recommendations || []).map((rec) => (
                  <div className="col-md-6" key={rec.listing_id}>
                    <div className="border rounded-3 p-3 h-100">
                      <div className="fw-semibold">
                        {rec.listing_id} - {rec.category}
                      </div>
                      <div className="text-muted small">Brand: {rec.brand}</div>
                      <div className="text-muted small">
                        Material: {rec.material}
                      </div>
                      <div className="text-muted small">
                        Tier: {rec.tier_primary}
                      </div>
                      <div className="text-muted small">
                        Price: ₹{rec.provider_price}
                      </div>
                      <div className="text-muted small">
                        Similarity: {rec.similarity_score}
                      </div>
                      <div className="text-muted small">
                        Reasons: {rec.explanation_reasons.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RenterRecommendationsPage;
