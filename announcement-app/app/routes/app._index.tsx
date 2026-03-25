import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs, HeadersFunction } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { useAppBridge } from "@shopify/app-bridge-react";
import customCss from "../styles/custom.css?url";

export const links = () => [
  { rel: "stylesheet", href: customCss }
];

export function shouldRevalidate({ formMethod, defaultShouldRevalidate }: any) {
  if (formMethod === "POST" || formMethod === "post") return false;
  return defaultShouldRevalidate;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const BACKEND_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api";
  let announcements = [];
  try {
    const res = await fetch(`${BACKEND_URL}/announcements?shop=${session.shop}`);
    if (res.ok) announcements = await res.json();
  } catch (err) {
    console.error("Backend fetch error:", err);
  }

  const activeAnnouncement = announcements.length > 0 ? announcements[0].text : "";
  return { announcements, activeAnnouncement };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const text = formData.get("announcementText") as string;
  
  if (!text) {
    return { success: false, error: "Text is required" };
  }

  const BACKEND_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api";

  try {
    const response = await fetch(`${BACKEND_URL}/announcement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop: session.shop,
        text,
        accessToken: session.accessToken
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }
  } catch (err) {
     return { success: false, error: "Failed to connect to backend server" };
  }

  return { success: true, text: text };
};

export default function Index() {
  const shopify = useAppBridge();
  const { announcements, activeAnnouncement } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [text, setText] = useState(activeAnnouncement || "");
  const [localList, setLocalList] = useState(announcements);

  useEffect(() => {
    setLocalList(announcements);
  }, [announcements]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success && fetcher.data?.text) {
      const savedText = fetcher.data.text; 
      if (localList.length === 0 || localList[0].text !== savedText) {
         setLocalList((prev: any[]) => [{ text: savedText, timestamp: new Date().toISOString() }, ...prev]);
      }
    }
  }, [fetcher.state, fetcher.data, localList]);

  let renderList = [...localList];
  if (fetcher.formData) {
    const pendingText = fetcher.formData.get("announcementText");
    if (pendingText) {
      renderList.unshift({
        text: pendingText.toString(),
        timestamp: new Date().toISOString(),
        isOptimistic: true 
      });
    }
  }

  return (
    <div className="ledger-layout">
      <div className="ledger-header-row">
        <div>
          <div className="ledger-header">
            <h1 className="ledger-title" style={{ fontSize: "2.2rem" }}>Announcement Manager</h1>
            <span className="ledger-badge">LIVE</span>
          </div>
          <p className="ledger-subtitle">Manage your storefront announcement banner</p>
        </div>
      </div>

      <div className="ledger-grid">
        {/* Left Column (Forms & Lists) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div className="ledger-card">
            <fetcher.Form method="post">
              <div className="ledger-card-header">
                <label className="ledger-label">ANNOUNCEMENT TEXT</label>
                <span className="char-count">{text.length} / 200</span>
              </div>
              <textarea
                name="announcementText"
                className="ledger-textarea"
                placeholder="🎉 Sale ends Sunday — 50% off sitewide!"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={200}
              />
              <div className="ledger-button-group">
                <button type="button" className="ledger-btn ledger-btn-tertiary" onClick={() => setText("")}>
                  Clear
                </button>
                <button type="submit" className="ledger-btn ledger-btn-primary">
                  Save & Publish
                </button>
              </div>
            </fetcher.Form>
          </div>

          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 1.5rem 0", color: "var(--on_surface)" }}>Recent Announcements</h2>
            <div className="ledger-list">
              {renderList.map((ann: any, index: number) => (
                <div key={index} className="ledger-list-item" style={{ opacity: ann.isOptimistic ? 0.6 : 1 }}>
                  <div className={`ledger-list-icon ${index > 0 ? 'grey' : ''}`}></div>
                  <div className="ledger-list-content">
                    <p className="ledger-list-title">{ann.text}</p>
                    <p className="ledger-list-meta">
                      {ann.isOptimistic ? "SAVING..." : `MODIFIED ${new Date(ann.timestamp).toLocaleString()}`} • {index === 0 ? 'BY ALEX M.' : 'SYSTEM AUTO'}
                    </p>
                  </div>
                </div>
              ))}
              {renderList.length === 0 && (
                <p style={{ padding: "1.5rem 2rem", color: "var(--on_surface_variant)" }}>No announcements history history yet. Save one to see it here.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="ledger-card-grey">
            <label className="ledger-label" style={{marginBottom: '1rem'}}>LIVE PREVIEW</label>
            <div className="preview-container">
              {text || "🎉 Sale ends Sunday — 50% off sitewide!"}
            </div>
            <div className="preview-mock-bar"></div>
            <div className="preview-mock-block"></div>
            <div className="preview-mock-split">
              <div></div>
              <div></div>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--on_surface_variant)", marginTop: "1.5rem", lineHeight: 1.4 }}>
              This preview illustrates how the banner will appear on your storefront's desktop view.
            </p>
          </div>

          <div className="tips-card">
            <label className="ledger-label" style={{ marginBottom: "1.5rem", display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{fontSize: '1.2rem'}}>💡</span> Writing Tips
            </label>
            <ul className="tips-list">
              <li><span className="tips-icon">✅</span> Keep it under 50 characters for mobile display.</li>
              <li><span className="tips-icon">✅</span> Use emojis to draw attention to key offers.</li>
              <li><span className="tips-icon">✅</span> Add a sense of urgency like "limited time".</li>
            </ul>
          </div>
          
          <div className="visualizing-card">
            <div className="visualizing-btn">VISUALIZING SUCCESS</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
