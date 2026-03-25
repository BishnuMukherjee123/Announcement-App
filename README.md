# Shopify Announcement Manager 📢
**A Production-Ready MERN Stack Application**

This repository contains the complete assignment submission for the Shopify Announcement Manager block. The application leverages a fully decoupled **MongoDB, Express, React, and Node.js** architecture, ensuring hyper-fast, highly scalable operations free from legacy constraints (e.g., deprecated `ScriptTags`).

## 🧱 The Architecture
This project is strictly divided into two distinct services representing a modern microservices approach:

### 1. The Frontend (`/announcement-app`)
A heavily customized React/Remix application deeply integrated with Shopify's App Bridge. 
- **Dashboard Interface:** Matches the strict "Curated Ledger" design blueprint.
- **Optimistic UI:** Utilizes advanced React hooks to inject "saved" status states locally in 0 milliseconds, bypassing standard network/fetch latency during background updates.
- **Storefront Theme App Extension:** Securely injects an App Embed Block into the merchant's theme using Liquid, floating perfectly alongside the UI without requiring code-injection techniques. 

### 2. The Backend (`/backend`)
A resilient, completely independent Express/Node.js REST API tasked with heavy data orchestration.
- **Background Mutational Syncing:** When an announcement is saved, the API caches the host details into `Map()` RAM memory, logs an audit history into **MongoDB Atlas**, and performs exactly one GraphQL `metafieldsSet` mutation against the host store (targeting `my_app.announcement`).
- **Production Defenses:** Outfitted with standard Express security middleware including `cors` restriction policies and `helmet` protections. Database read-heavy pipelines feature an active Time-To-Live (TTL) cache eviction mechanism.

---

## 🚀 How to Run Locally

Because the architecture is strictly decoupled, you must boot the two services in separate terminal windows.

### Step 1: Start the Express Backend
Open Terminal #1, navigate to the `backend` folder, and initiate the Node server.

```bash
cd backend
npm install
npm start
```
*Note: Make sure your current IP address is whitelisted on your MongoDB Atlas dashboard, or the backend will fail to connect.*

### Step 2: Start the Shopify React Frontend
Open Terminal #2, navigate to the `announcement-app` folder, and initiate the Shopify CLI Server.

```bash
cd announcement-app
npm install
npm run dev
```

### Step 3: Install & Test
Follow the standard Shopify CLI prompt from Terminal #2 to install the app on a Development Store. Once installed:
1. Open the App inside the Shopify Admin panel.
2. Type an announcement and click **Save & Publish**.
3. View the live changes float seamlessly on the active Online Store preview. 
4. Check MongoDB Atlas to view the persistent audit logs recording all historical changes.
