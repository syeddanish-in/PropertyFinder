# PropertyFinder — Property Listing Search & Filter (jQuery + Bootstrap)

A lightweight, responsive property listing web application built with **jQuery**, **AJAX**, and **Bootstrap 5**. Users can search properties in real time, combine multi-criteria filters, sort results, save favorites with `localStorage`, paginate through listings, inspect full details in a Bootstrap modal, and submit a client-side validated inquiry form — all without page reloads.

🔗 **Live Demo:** https://syeddanish-in.github.io/PropertyFinder/

---

## Features

- **AJAX Data Loading with Loading, Error & Retry States**: Fetches 12 listings asynchronously from `data/properties.json` via `$.ajax()`, showing a Bootstrap spinner while loading and an error alert with a one-click **Retry** button on failure.
- **Debounced Live Keyword Search (200ms)**: Searches across property **title**, **location**, **type**, and **description** in real time while debouncing rapid keystrokes (`setTimeout` / `clearTimeout`).
- **Multi-Criteria Filtering & Dynamic Dropdowns**: Filter by dynamically populated **Location**, **Property Type**, **Bedrooms** (1, 2, 3, 4+), and **Min/Max Price** range (with non-negative validation), plus a live **Showing X of Y** counter and one-click **Reset**.
- **Sorting & Pagination**: Sort filtered results by **Price (Low → High / High → Low)**, **Area (Largest First)**, or **Featured First**, with client-side **Load More** pagination (6 items per batch).
- **Favorites Wishlist (`localStorage`)**: Bookmark properties with a heart button on each card and filter by **Show Favorites Only** — saved selections persist across browser refreshes.
- **Responsive Bootstrap 5 UI & Image Fallback**: Adapts seamlessly across desktop (3 columns), tablet (2 columns), and mobile (1 column) using Bootstrap 5 grid, Bootstrap Icons, hover transitions, and automatic `onerror` placeholder image fallbacks.
- **Bootstrap Modal & Client-Side Form Validation**: Uses jQuery event delegation on dynamically rendered cards to open a property details modal with property-specific inquiry context, pre-filled message text, form reset when switching properties, and inline validation for name, email, and message.

---

## Technologies Used

- **HTML5 & CSS3**
- **Bootstrap 5 & Bootstrap Icons** (Responsive Grid, Cards, Navbar, Spinner, Alerts, Modal)
- **JavaScript & jQuery 3.7** (DOM Manipulation, Event Delegation, Debouncing, Filtering, Sorting, Form Validation)
- **AJAX, JSON & `localStorage`**
- **Git & GitHub Pages**

---

## Project Structure

```text
PropertyFinder/
├── index.html            # Main layout, filter controls, listings grid, and Bootstrap modal
├── css/
│   └── style.css         # Custom card image sizing, hover animations, and modal image styles
├── js/
│   └── app.js            # jQuery AJAX, dynamic rendering, live filters, sorting, favorites, modal & validation
├── data/
│   └── properties.json   # Mock dataset of 12 property listings
└── README.md             # Project documentation
```

---

## Screenshots

> *Tip: Take screenshots of your live app (`screenshots/home.png` and `screenshots/modal.png`) and uncomment the lines below to display them directly on GitHub!*

<!--
### Listings & Multi-Criteria Filter View
![PropertyFinder Listings Grid](screenshots/home.png)

### Property Details Modal & Validated Inquiry Form
![PropertyFinder Details Modal](screenshots/modal.png)
-->

---

## Run Locally

Because the app loads `data/properties.json` via AJAX, serve the folder using a local web server (opening `index.html` directly via `file://` is blocked by browser CORS policies):

1. **Clone the repository**
   ```bash
   git clone https://github.com/syeddanish-in/PropertyFinder.git
   cd PropertyFinder
   ```
2. **Start a local server**
   - **VS Code**: Right-click `index.html` and choose **Open with Live Server**, *or*
   - **Python**:
     ```bash
     python -m http.server 8000
     ```
     Then open `http://localhost:8000` in your browser.
