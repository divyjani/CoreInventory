This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# CoreInventory — Modular Inventory Management System

## Overview

**CoreInventory** is a modular **Inventory Management System (IMS)** designed to digitize and streamline stock operations within a business. The system replaces manual registers and Excel-based tracking with a centralized, real-time web application.

The application allows businesses to manage products, track incoming and outgoing inventory, and monitor stock levels through an intuitive dashboard.

This project is built as a **hackathon-level prototype** using modern web technologies and focuses on:

* Real-time inventory tracking
* Clean and responsive user interface
* Modular backend APIs
* Efficient database operations
* Clear inventory workflow demonstration

---

## Problem Statement

Many organizations still rely on spreadsheets or manual registers to manage inventory, which leads to:

* Data inconsistency
* Difficulty tracking stock movements
* Lack of centralized visibility
* Errors in stock calculations
* Poor scalability

CoreInventory solves this problem by providing a **centralized digital inventory system** capable of managing stock movements across different operations.

---

## Key Features

### 1. Product Management

Users can create and manage products within the inventory.

Each product contains:

* Name
* SKU (Stock Keeping Unit)
* Category
* Current Stock

The system maintains stock values automatically based on inventory operations.

---

### 2. Receipts (Incoming Stock)

Receipts represent **incoming goods from suppliers**.

Example workflow:

Vendor sends 50 units of a product →
User creates a **Receipt** →
Stock increases automatically.

---

### 3. Deliveries (Outgoing Stock)

Deliveries represent **products leaving the warehouse**, usually for customers.

Example workflow:

Customer orders 10 chairs →
User creates **Delivery Order** →
Stock decreases automatically.

---

### 4. Dashboard

The dashboard provides a quick overview of inventory health.

Displayed metrics include:

* Total products
* Low stock items
* Overall inventory snapshot

This allows inventory managers to quickly identify issues such as low stock.

---

### 5. Low Stock Alert

Products with stock below a defined threshold automatically trigger alerts, helping businesses restock before shortages occur.

---

### 6. Modular API Architecture

The backend is built using **Next.js API Routes**, allowing both frontend and backend logic to coexist in the same project.

Each inventory operation is exposed as an API endpoint.

Example endpoints:

* `/api/products`
* `/api/receipts`
* `/api/deliveries`
* `/api/dashboard`

---

## Technology Stack

### Frontend

* **Next.js (App Router)**
* **React**
* **TypeScript**
* **Tailwind CSS**

The UI is designed to be responsive and minimal, allowing users to interact with inventory data quickly.

---

### Backend

* **Next.js API Routes**

This enables server-side logic within the same project without requiring a separate backend server.

---

### Database

* **MongoDB**
* **Mongoose ORM**

MongoDB provides flexible document-based storage suitable for rapid development during hackathons.

---

### Development Tools

* **Antigravity AI coding assistant**
* **VS Code**
* **Node.js**
* **Git**

Antigravity was used to accelerate development by generating structured components, APIs, and models.

---

## System Architecture

```
User Interface (Next.js Pages)
        │
        ▼
Next.js API Routes
        │
        ▼
Mongoose Models
        │
        ▼
MongoDB Database
```

This architecture allows the application to maintain a clean separation between:

* UI components
* API logic
* database models

---

## Project Structure

```
inventory-app
│
├── src
│
│  ├── app
│  │  ├── dashboard
│  │  │   └── page.tsx
│  │  ├── products
│  │  │   └── page.tsx
│  │  ├── receipts
│  │  │   └── page.tsx
│  │  ├── deliveries
│  │  │   └── page.tsx
│  │
│  │  └── api
│  │      ├── products
│  │      │   └── route.ts
│  │      ├── receipts
│  │      │   └── route.ts
│  │      ├── deliveries
│  │      │   └── route.ts
│  │      └── dashboard
│  │          └── route.ts
│
│  ├── models
│  │   ├── Product.ts
│  │   ├── Receipt.ts
│  │   └── Delivery.ts
│
│  ├── components
│  │   ├── Sidebar.tsx
│  │   ├── ProductForm.tsx
│  │   ├── ProductTable.tsx
│  │   └── DashboardCards.tsx
│
│  └── lib
│      └── mongodb.ts
```

---

## Inventory Workflow

The system demonstrates a complete inventory lifecycle:

```
Create Product
       ↓
Receive Stock
       ↓
Update Inventory
       ↓
Deliver Product
       ↓
Stock Updates Automatically
```

Example:

1. Create Product: **Steel Rod**
2. Receive **100 units**
3. Deliver **20 units**
4. Dashboard shows **80 remaining stock**

---

## Installation

### 1. Clone Repository

```
git clone <repository-url>
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

Create `.env.local`

```
MONGODB_URI=your_mongodb_connection_string
```

---

### 4. Run Development Server

```
npm run dev
```

Application will start at:

```
http://localhost:3000
```

---

## Future Improvements

Potential enhancements include:

* Multi-warehouse support
* Inventory transfer between locations
* Authentication system
* Role-based access control
* Detailed stock movement ledger
* Advanced analytics dashboard
* AI-powered stock forecasting

---

## Hackathon Focus

This project prioritizes:

* Rapid development
* Clean architecture
* Demonstrable functionality
* Clear inventory workflow

The goal was to build a **working prototype demonstrating a real-world inventory management scenario** within a limited hackathon timeframe.

---

## Authors

Divy Jani Kamlesh Kumar
Manan Shah

---

## License

This project is developed for educational and hackathon purposes.


You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
