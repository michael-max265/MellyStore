# MellyStore — Contemporary Luxury Womenswear & Atelier

[![Live Demo](https://img.shields.io/badge/Live%20Demo-melly--store--seven.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://melly-store-seven.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An editorial e-commerce platform crafted with **React 19**, **TypeScript**, and **Tailwind CSS**. Designed for an atelier luxury fashion label, MellyStore combines understated architectural aesthetics with client concierge styling, dynamic multi-currency handling, a realistic multi-channel payment sandbox, and an administrative back-office terminal.

---

## 🔗 Live Deployments & Links

* 🌐 **Live Storefront:** [https://melly-store-seven.vercel.app/](https://melly-store-seven.vercel.app/)
* 💻 **GitHub Repository:** [https://github.com/michael-max265/MellyStore](https://github.com/michael-max265/MellyStore)
* 👨‍💻 **Developer Portfolio:** [https://michael-portfolio-brown.vercel.app/](https://michael-portfolio-brown.vercel.app/)

---

## ✨ Key Architectural Features

### 1. Luxury Merchandising & Lookbooks
* **"Shop The Look" Outfits:** Interactive editorial outfit bundles with one-click capsule cart additions.
* **Live Multi-Currency Engine:** Instant price conversions across **USD ($), EUR (€), GBP (£), NGN (₦), and CAD ($)** with real-time recalculations.
* **Faceted Filtering:** Real-time client filtering by silhouette category, price bracket, noble fiber composition (22-momme Mulberry silk, Grade-A cashmere, virgin wool), and size.
* **Interactive Modals:** Detailed views with color swatches, size recommendations, fabric care, and customer reviews.

### 2. Multi-Channel Payment Sandbox
* **Dynamic Card Brand Detection:** Real-time BIN analysis detecting **Visa, Mastercard, Verve (Nigerian domestic), and American Express**.
* **One-Click Sandbox Presets:** Instant test credentials for quick authorization walkthroughs.
* **Nigerian Bank Transfer Verification:** GTBank corporate account deposit flow with live simulation of incoming credit verification via NIBSS.
* **Apple Pay / Google Pay:** Simulated one-touch biometric authorization (Touch ID / Face ID).

### 3. Client Services & Post-Purchase Hub
* **Digital Email Receipt Modal:** In-browser preview of branded HTML dispatch notifications sent to the customer's email.
* **Consignment Tracker:** Real-time status lookup (*Confirmed, In Atelier Processing, Dispatched, Delivered*) using order numbers or tracking IDs.
* **Official Printable Invoices:** Itemized studio receipts ready for printing or PDF export.

### 4. Smart Studio Concierge Stylist
* **AI Wardrobe Advisor:** Interactive styling desk providing fabric care protocols, silhouette matching, and personalized event outfit curation.
* **One-Tap Capsule Addition:** Instant addition of all recommended look silhouettes to the shopping bag.

### 5. Atelier Admin Dashboard
* **Security Keypad Terminal:** Protected with a default PIN (`8166`) and master fallback (`2026`), with in-terminal PIN customization.
* **Inventory Management:** Full CRUD operations for catalog products, inventory stock adjustments, and order fulfillment updates.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19 (Hooks, Context API) |
| **Language & Typings** | TypeScript (Strict mode enabled) |
| **Build Tool & Bundler**| Vite 8.3 |
| **Styling & Design**   | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| **Icons & Visuals**    | Lucide React, Canvas Confetti |
| **Deployment**         | Vercel |

---

## 🚀 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/michael-max265/MellyStore.git
   cd MellyStore
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔐 Admin Access Credentials

* **Default PIN:** `8166`
* **Master Fallback PIN:** `2026`
* *Accessible via the client profile menu or the Admin icon in the navigation bar.*

---

## 👨‍💻 Author

**Michael Max**
* **Portfolio:** [https://michael-portfolio-brown.vercel.app/](https://michael-portfolio-brown.vercel.app/)
* **GitHub:** [@michael-max265](https://github.com/michael-max265)
