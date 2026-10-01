# User-frontend - Ecobazar End User Web App

This is the dedicated frontend project for end users / customers of **Ecobazar**.

## Project Structure
```
User-frontend/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── pages/
    │   └── Home.jsx
    └── components/
        ├── layout/
        │   ├── TopHeader.jsx
        │   ├── MainHeader.jsx
        │   └── Navbar.jsx
        └── home/
            ├── HeroBanners.jsx
            └── FeatureCards.jsx
```

## How to Run

1. Open your terminal and navigate to this folder:
```bash
cd User-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Vite dev server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5174` (or the port shown in your terminal).

## Customizing Photos
You can replace any photo by editing `BANNER_PHOTOS` in `src/components/home/HeroBanners.jsx`.
