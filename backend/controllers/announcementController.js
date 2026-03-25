import Announcement from "../models/Announcement.js";

// Extremely fast memory cache to avoid repeatedly querying Shopify for the static Host Shop ID
const shopIdCache = new Map();

// In-Memory cache for announcements to bypass 400ms+ MongoDB Atlas fetch delays
const historyCache = new Map();
// 🚀 Memory Auto-Cleaner: Industry-grade 30 second High-Traffic TTL
const CACHE_TTL = 1000 * 30;

/**
 * @desc    Fetch Announcement History
 * @route   GET /api/announcements
 */
export const getAnnouncements = async (req, res, next) => {
  try {
    const { shop } = req.query;
    if (!shop) {
      res.status(400);
      throw new Error("Shop parameter is required");
    }

    // 🚀 OPTIMIZATION: Check Memory Cache first!
    let cacheWrapper = historyCache.get(shop);

    // Auto-clean the memory if it's older than 5 minutes
    if (cacheWrapper && (Date.now() - cacheWrapper.updatedAt > CACHE_TTL)) {
      historyCache.delete(shop);
      cacheWrapper = null;
    }

    let announcements = cacheWrapper ? cacheWrapper.data : null;

    if (!announcements) {
      // Only hit the external remote MongoDB cluster if the cache is completely empty or expired
      announcements = await Announcement.find({ shop })
        .sort({ timestamp: -1 })
        .limit(5)
        .lean();
        
      historyCache.set(shop, { data: announcements, updatedAt: Date.now() });
    }

    res.status(200).json(announcements);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save announcement to Database & Mutate Shopify Metafield
 * @route   POST /api/announcement
 */
export const createAnnouncement = (req, res, next) => {
  try {
    const { shop, text, accessToken } = req.body;

    if (!shop || !text || !accessToken) {
      res.status(400);
      throw new Error("Missing required fields (shop, text, accessToken)");
    }

    // 🚀 ULTRA-OPTIMIZATION: Fire And Forget
    // Immediately return success to the frontend in ~2 milliseconds!
    // We do NOT block the HTTP request waiting for Shopify or MongoDB arrays.
    res.status(202).json({ success: true, message: "Processing instantly in background." });

    // --- INSTANT CACHE UPDATE ---
    // Inject the newest array directly into the backend's RAM cache so the 
    // upcoming frontend reload GET request finds it flawlessly in zero milliseconds.
    let cacheWrapper = historyCache.get(shop);
    let cached = cacheWrapper ? cacheWrapper.data : [];
    cached.unshift({ shop, text, timestamp: new Date() });
    historyCache.set(shop, { data: cached.slice(0, 5), updatedAt: Date.now() });

    // --- BACKGROUND TASK 1: Save to MongoDB ---
    Announcement.create({ shop, text }).catch(err => 
      console.error("Background DB Save Error:", err)
    );

    // --- BACKGROUND TASK 2: Sync to Shopify Metafields ---
    (async () => {
      try {
        let ownerId = shopIdCache.get(shop);
        
        if (!ownerId) {
          const shopQueryResponse = await fetch(`https://${shop}/admin/api/2024-10/graphql.json`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": accessToken,
            },
            body: JSON.stringify({ query: `query { shop { id } }` }),
          });

          const shopData = await shopQueryResponse.json();
          ownerId = shopData?.data?.shop?.id;
          if (ownerId) shopIdCache.set(shop, ownerId);
        }

        if (ownerId) {
          const metafieldResponse = await fetch(`https://${shop}/admin/api/2024-10/graphql.json`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": accessToken,
            },
            body: JSON.stringify({
              query: `mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
                metafieldsSet(metafields: $metafields) {
                  userErrors { message }
                }
              }`,
              variables: {
                metafields: [
                  {
                    ownerId: ownerId,
                    namespace: "my_app",
                    key: "announcement",
                    value: text,
                    type: "single_line_text_field",
                  },
                ],
              },
            }),
          });
          
          const mfData = await metafieldResponse.json();
          if (mfData?.data?.metafieldsSet?.userErrors?.length > 0) {
             console.error("Shopify Background Sync Error:", mfData.data.metafieldsSet.userErrors[0].message);
          }
        }
      } catch (err) {
        console.error("Shopify Background Sync Execution Error:", err);
      }
    })();

  } catch (error) {
    next(error);
  }
};
