# PropertyFinder — Property Listing Search & Filter (jQuery + Bootstrap)

A lightweight, responsive property listing web application built with **jQuery**, **AJAX**, and **Bootstrap 5**. Users can search properties in real time, combine multiple filters without page reloads, inspect full property details in a Bootstrap modal, and submit a client-side validated inquiry form.

🔗 **Live Demo:** https://syeddanish-in.github.io/PropertyFinder/

---

## Features

- **AJAX Data Loading with States**: Fetches listing data asynchronously from a JSON source (`data/properties.json`) using `$.ajax()`, displaying a loading spinner while fetching and an alert banner if loading fails.
- **Live Keyword Search**: Filters properties instantly on every keystroke by title or location with zero page reloads.
- **Multi-Criteria Filtering**: Combine filters for **Location**, **Bedrooms** (1, 2, 3, 4+), and **Max Price**, plus a one-click **Reset** button and an empty-state alert when no matches are found.
- **Responsive Bootstrap 5 Grid**: Adapts automatically across desktop (3 columns), tablet (2 columns), and mobile (1 column) with uniform card heights and hover transitions.
- **Bootstrap Modal for Property Details**: Uses jQuery event delegation on dynamically rendered cards to populate and open a modal displaying full property specs and description.
- **Client-Side Form Validation**: Validates the inquiry form (name length, email format, message length) without refreshing the page, showing inline error messages or a confirmation banner.

---

## Technologies Used

- **HTML5 & CSS3**
- **Bootstrap 5** (Responsive Grid, Cards, Navbar, Spinner, Alerts, Modal)
- **JavaScript & jQuery 3.7** (DOM Manipulation, Event Delegation, Filtering, Form Validation)
- **AJAX & JSON** (Asynchronous data loading from a mock REST/JSON source)
- **Git & GitHub Pages**

---

## Project Structure

```text
PropertyFinder/
├── index.html            # Main layout, filter controls, listings grid, and Bootstrap modal
├── css/
│   └── style.css         # Custom card image sizing, hover animations, and modal image styles
├── js/
│   └── app.js            # jQuery AJAX, dynamic rendering, live filtering, modal & form validation
├── data/
│   └── properties.json   # Mock property listings dataset
└── README.md             # Project documentation
```

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
