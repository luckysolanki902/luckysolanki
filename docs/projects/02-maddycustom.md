# MaddyCustom — E-Commerce Platform for Bike Wrap Stickers

> **Role**: Co-Founder & Lead Developer
> **Timeline**: Sep 2023 → Feb 2026 (left the company)
> **Status**: Site was live at maddycustom.com — company shifted to Shopify after departure. All complex custom logic was written by Lucky.

---

## Links

| Type | URL |
|------|-----|
| **Production Site** | [maddycustom.com](https://www.maddycustom.com) (shifted to Shopify post-departure) |
| **Production (custom-built)** | [maddycustom.vercel.app](https://maddycustom.vercel.app) (Lucky's version on Vercel) |
| **Admin Panel** | [admin-maddy-custom.vercel.app](https://admin-maddy-custom.vercel.app) |
| **GitHub (Private)** | maddycustom (499), admin-maddy-custom (499), Maddy-Custom/maddycustom-production (802), mym-admin (32) |
| **Organization** | [github.com/Maddy-Custom](https://github.com/Maddy-Custom) (owned by Lucky) |

---

## One-Liner

A full-stack e-commerce platform for custom bike wrap stickers — with a product configurator, dual payment gateways (Razorpay + PayU), Shiprocket shipping integration, Meta Conversions API, AI-powered customer support, OTP authentication, and a complete admin panel with analytics, inventory management, and order fulfillment workflows. Revenue: ₹60 lakhs annually at peak.

---

## The Business

MaddyCustom sells custom vinyl wrap stickers for bikes (motorcycles) across India. Customers browse bike models, select designs, customize options, and place orders — all through a custom-built e-commerce platform. The business had:

- **₹60 lakhs annual revenue** when Lucky left in Feb 2026
- Product catalog spanning multiple bike brands and models
- B2B wholesale channel
- Customer support via WhatsApp integration
- Full order-to-delivery pipeline

**Why Lucky left**: The company decided to migrate to Shopify. Lucky built all the complex custom logic (payment integrations, shipping APIs, analytics pipelines, admin tools) from scratch and wasn't interested in maintaining a Shopify store.

---

## Architecture — 4 Codebases

### 1. maddycustom (499 commits) — Original Storefront
- **Framework**: Next.js (Pages Router)
- **UI**: React, MUI 6, Framer Motion, Swiper, react-spring
- **State**: Redux Toolkit
- **Auth**: NextAuth.js
- **Database**: MongoDB (Mongoose 7)
- **Payments**: Razorpay
- **Storage**: AWS S3 (presigned uploads)
- **Email**: Nodemailer
- **Analytics**: Vercel Analytics, Vercel Speed Insights, Facebook Pixel, Recharts
- **Image Processing**: Sharp
- **SMS**: Twilio (OTP verification)
- **Other**: Archiver (zip generation), json2csv, JSZip, dynamic sitemap generation

### 2. Maddy-Custom/maddycustom-production (802 commits) — Production Storefront v2
Migrated to Next.js 15 (App Router) with significant feature additions:

- **Framework**: Next.js 15 (App Router)
- **Auth**: Clerk
- **Payments**: Razorpay + PayU (dual gateway)
- **Shipping**: Shiprocket API (catalog sync, order fulfillment)
- **Meta Integration**: Facebook Conversions API (server-side tracking), Pixel products CSV/XML feeds, dynamic catalog triggers
- **AI**: OpenAI API (customer support assistant)
- **Analytics**: Google Analytics API, custom analytics pipeline, client logging
- **Search**: Full-text product search
- **SEO**: Dynamic sitemap.js, robots.js, manifest.js, structured meta
- **Testing**: Playwright E2E tests
- **B2B**: Wholesale ordering system
- **Rich Text**: Editor.js (product descriptions)
- **Drag & Drop**: @hello-pangea/dnd (display asset management)

### 3. admin-maddy-custom (499 commits) — Admin Panel
Full-featured admin dashboard:

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Auth**: Clerk (role-based access management)
- **Charts/Analytics**: Recharts, Chart.js, MUI X Charts, D3 Sankey diagrams
- **Export**: jsPDF + jspdf-autoTable (PDF generation), xlsx (Excel), react-csv, PapaParse
- **Scheduling**: node-cron (automated tasks)
- **AI**: OpenAI (content generation, product descriptions)
- **Image**: Sharp, browser-image-compression, react-dropzone

### 4. mym-admin (32 commits) — Earlier Admin Version
Legacy admin panel, replaced by admin-maddy-custom.

---

## Complex Engineering

### 1. Dual Payment Gateway Architecture
- **Razorpay** + **PayU** — seamless gateway switching for reliability
- Webhook handlers for payment confirmation, refund processing
- Order status state machine (pending → confirmed → processing → shipped → delivered)

### 2. Meta Conversions API (Server-Side Tracking)
- Server-side event tracking via Facebook Business SDK
- Dynamic product catalog (CSV + XML format) for Meta Ads
- Catalog status monitoring + manual trigger endpoints
- Pixel integration for client-side + CAPI for server-side (deduplication)
- Lazy-loaded SDK to prevent serverless bundling issues (`f is not a function` fix)

### 3. Shiprocket Shipping Integration
- Product catalog sync with Shiprocket (unique numeric IDs per variant)
- Real-time shipping rate calculation
- Order creation and label generation
- Tracking integration

### 4. Analytics Pipeline (Admin Panel)
- **Customer Journey Tracking**: Full funnel visualization (visit → product view → add to cart → checkout → payment → purchase) with conversion rates
- **Abandoned Cart Analysis**: Identify users who started checkout but didn't complete
- **Traffic & Engagement Graphs**: Custom redesigned dashboards with date filtering
- **D3 Sankey Diagrams**: Visual flow of customer journey between stages
- **Repeat Buyer Analysis**: Category analysis showing which first-purchase categories best convert into repeat buyers
- **Revenue Calculations**: Real-time revenue dashboards with period comparison
- **Funnel Comparison**: Side-by-side funnel metrics with custom date windows

### 5. Inventory & Product Management
- **Design Groups**: Organized product templates with drag-and-drop ordering
- **Design Search**: Full-text search across design templates with exact match
- **Download System**: Bulk download of raw design files from S3 (zip generation, email delivery, secure download links with verification)
- **Inventory Tracking**: Stock levels per variant, availability filters, daily record tracking (with "near miss" celebrations when approaching records)
- **Productivity Dashboard**: Team performance metrics, order fulfillment tracking
- **RTO Management**: Return-to-origin order tracking

### 6. In-App Product Configurator
- Browse by bike brand → bike model → available designs
- Full-screen product zoom with gesture controls (zoom out on back button, not navigation)
- Design template previews applied to bike models
- Custom sticker options selection

### 7. OTP-Based Authentication via Twilio
- SMS-based OTP verification for order placement
- Clerk-based authentication with role-based access (admin panel)
- JWT tokens for API security

### 8. Customer Support System
- **AI Assistant**: OpenAI-powered customer support chatbot
- **WhatsApp Integration**: Direct WhatsApp links for human support
- **Feature Requests**: Customer-submitted feature requests with admin dashboard
- **Review System**: Customer reviews with image upload, admin moderation

### 9. B2B Wholesale Channel
- Dedicated B2B ordering flow
- Bulk pricing and order management

### 10. Production Workflow
- **Production Page**: Order queue for production team with status tracking
- **Packaging Boxes**: Inventory management for packaging materials
- **Department Management**: Multi-department admin access with role permissions

---

## Data Models

| Model | Purpose |
|-------|---------|
| Bikes | Bike brand/model catalog with associated designs |
| Product | Product catalog with variants, pricing, inventory |
| Customer | Customer profiles with order history |
| Coupon | Discount codes with usage tracking |
| HappyCustomers | Customer testimonials/showcase |
| HelmetBrand | Helmet product category |
| WebhookLog | Payment/shipping webhook audit trail |
| Bikenotfound | Customer requests for unlisted bikes |

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 18, MUI 6, Framer Motion, Redux Toolkit, Clerk, Swiper |
| **Backend** | Next.js API Routes, Mongoose 8, Sharp, Archiver |
| **Database** | MongoDB Atlas |
| **Payments** | Razorpay + PayU (dual gateway) |
| **Shipping** | Shiprocket API |
| **Auth** | Clerk (admin), Twilio OTP (customers), JWT |
| **Storage** | AWS S3 (presigned URLs, bulk download) |
| **Email** | Nodemailer |
| **SMS** | Twilio |
| **AI** | OpenAI API (customer support, content) |
| **Analytics** | Meta Conversions API, Google Analytics, Recharts, Chart.js, D3 Sankey |
| **Testing** | Playwright |
| **Hosting** | Vercel |
| **SEO** | Dynamic sitemap, robots, OG images, Meta product feeds |

---

## Metrics

| Metric | Value |
|--------|-------|
| Total commits | ~1,832 (499 + 499 + 802 + 32) |
| Annual revenue | ₹60 lakhs (~$7.2K USD) at peak |
| Active period | Sep 2023 → Feb 2026 (2.5 years) |
| Codebases | 4 (storefront v1, production v2, admin panel, legacy admin) |
| API endpoints | 40+ (payments, shipping, analytics, meta, inventory, etc.) |
| Payment gateways | 2 (Razorpay + PayU) |

---

## Portfolio Positioning

**Co-founder story**: Built the entire tech stack for a revenue-generating e-commerce business from zero. ₹60 lakhs annual revenue proves market validation. The product was complex enough that the company struggled to maintain it on Shopify — the custom logic (dual payments, Meta CAPI, Shiprocket, analytics pipelines, AI support) was all custom-built.

**Engineering depth**: Not a simple Shopify store. Custom payment orchestration, server-side ad tracking, real-time analytics with Sankey diagrams, bulk S3 operations, AI-powered support, E2E tests, production workflow management. Full product engineer scope — from database schema to checkout UX to shipping label generation.

**Business impact**: Real revenue. Real customers. Real orders being packed and shipped. Not a toy project — a business that hired multiple people and generated real income.
