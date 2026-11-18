$(document).ready(function () {
  // Store all fetched properties here so we can filter them later without re-fetching
  let allProperties = [];
  let currentFiltered = [];
  const PAGE_SIZE = 6;
  let visibleCount = PAGE_SIZE;

  // Load saved favorite property IDs from localStorage
  let favorites = JSON.parse(localStorage.getItem('favoriteProperties')) || [];

  function updateFavCount() {
    $('#fav-count').text(favorites.length);
  }

  // 1. Fetch property data from our JSON file using jQuery AJAX
  function fetchProperties() {
    $('#loading-msg').show();
    $('#error-msg').hide();

    $.ajax({
      url: 'data/properties.json',
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        $('#loading-msg').hide();
        allProperties = data;
        populateLocationFilter(allProperties);
        displayProperties(allProperties);
      },
      error: function () {
        $('#loading-msg').hide();
        $('#error-msg').show();
      }
    });
  }

  // Populate the Location dropdown dynamically from fetched JSON data
  function populateLocationFilter(properties) {
    const $locationSelect = $('#location-filter');
    $locationSelect.find('option:not(:first)').remove();

    const uniqueLocations = [...new Set(properties.map(function (p) { return p.location; }))].sort();
    uniqueLocations.forEach(function (loc) {
      $locationSelect.append(`<option value="${loc}">${loc}</option>`);
    });
  }

  // 2. Render properties dynamically into the #property-list container
  function displayProperties(properties) {
    currentFiltered = properties;
    const $list = $('#property-list');
    $list.empty(); // Clear previous items before rendering

    const toShow = properties.slice(0, visibleCount);

    // Update live results counter
    $('#results-count').text(`Showing ${toShow.length} of ${properties.length} properties`);

    if (properties.length === 0) {
      $('#no-results-msg').show();
      $('#load-more-btn').hide();
      return;
    }

    $('#no-results-msg').hide();

    toShow.forEach(function (property) {
      const featuredBadge = property.featured
        ? '<span class="badge bg-warning text-dark ms-2">Featured</span>'
        : '';
      const isFav = favorites.includes(property.id);

      const cardHtml = `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 property-card shadow-sm">
            <img src="${property.image}" class="card-img-top" alt="${property.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${property.title}${featuredBadge}</h5>
              <p class="text-muted mb-1">
                <i class="bi bi-geo-alt-fill text-danger me-1"></i>${property.location} &bull; ${property.type}
              </p>
              <p class="fs-5 fw-bold text-primary mb-2">$${property.price.toLocaleString()}</p>
              <p class="card-text small text-secondary">
                <i class="bi bi-door-open me-1"></i>${property.bedrooms} Beds &bull;
                <i class="bi bi-droplet me-1"></i>${property.bathrooms} Baths &bull;
                <i class="bi bi-aspect-ratio me-1"></i>${property.area} sq ft
              </p>
              <div class="d-flex gap-2 mt-auto">
                <button type="button" class="btn btn-outline-primary flex-grow-1 view-details-btn" data-id="${property.id}">
                  <i class="bi bi-eye me-1"></i>View Details
                </button>
                <button type="button" class="btn ${isFav ? 'btn-danger' : 'btn-outline-danger'} fav-btn" data-id="${property.id}" title="Save to Favorites">
                  <i class="bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      $list.append(cardHtml);
    });

    // Show or hide the Load More button
    if (visibleCount < properties.length) {
      $('#load-more-btn').show();
    } else {
      $('#load-more-btn').hide();
    }
  }

  // 3. Filter properties using all active criteria
  function filterProperties(resetPage) {
    if (resetPage !== false) {
      visibleCount = PAGE_SIZE;
    }
    const keyword = $('#search-input').val().toLowerCase().trim();
    const location = $('#location-filter').val();
    const type = $('#type-filter').val();
    const bedrooms = $('#bedroom-filter').val();
    const minPrice = $('#min-price-filter').val();
    const maxPrice = $('#price-filter').val();
    const favoritesOnly = $('#favorites-only').is(':checked');

    const filtered = allProperties.filter(function (property) {
      const matchesKeyword =
        keyword === '' ||
        property.title.toLowerCase().includes(keyword) ||
        property.location.toLowerCase().includes(keyword) ||
        property.type.toLowerCase().includes(keyword) ||
        property.description.toLowerCase().includes(keyword);

      const matchesLocation =
        location === '' || property.location === location;

      const matchesType =
        type === '' || property.type === type;

      const matchesBedrooms =
        bedrooms === '' ||
        (bedrooms === '4'
          ? property.bedrooms >= 4
          : property.bedrooms === Number(bedrooms));

      const matchesMinPrice =
        minPrice === '' || property.price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === '' || property.price <= Number(maxPrice);

      const matchesFavorite =
        !favoritesOnly || favorites.includes(property.id);

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesType &&
        matchesBedrooms &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesFavorite
      );
    });

    // Sort the filtered results based on the selected option
    const sortBy = $('#sort-filter').val();
    if (sortBy === 'price-asc') {
      filtered.sort(function (a, b) { return a.price - b.price; });
    } else if (sortBy === 'price-desc') {
      filtered.sort(function (a, b) { return b.price - a.price; });
    } else if (sortBy === 'area-desc') {
      filtered.sort(function (a, b) { return b.area - a.area; });
    } else if (sortBy === 'featured') {
      filtered.sort(function (a, b) { return Number(b.featured) - Number(a.featured); });
    }

    displayProperties(filtered);
  }

  // Debounce helper: waits 200ms after typing pauses before filtering
  let searchTimer;
  function debouncedFilter() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(filterProperties, 200);
  }

  // 4. Event listeners for live search & multi-criteria filtering (no page reload)
  $('#search-input, #min-price-filter, #price-filter').on('input', debouncedFilter);
  $('#location-filter, #type-filter, #bedroom-filter, #sort-filter, #favorites-only').on('change', filterProperties);

  // Toggle favorite property and persist in localStorage
  $('#property-list').on('click', '.fav-btn', function () {
    const propertyId = Number($(this).data('id'));
    const index = favorites.indexOf(propertyId);

    if (index === -1) {
      favorites.push(propertyId);
    } else {
      favorites.splice(index, 1);
    }

    localStorage.setItem('favoriteProperties', JSON.stringify(favorites));
    updateFavCount();
    filterProperties(false);
  });

  // Load More button shows the next batch of properties
  $('#load-more-btn').on('click', function () {
    visibleCount += PAGE_SIZE;
    displayProperties(currentFiltered);
  });

  // 5. Reset button clears all inputs and shows all properties again
  $('#reset-btn').on('click', function () {
    clearTimeout(searchTimer);
    visibleCount = PAGE_SIZE;
    $('#search-input').val('');
    $('#location-filter').val('');
    $('#type-filter').val('');
    $('#bedroom-filter').val('');
    $('#min-price-filter').val('');
    $('#price-filter').val('');
    $('#sort-filter').val('default');
    $('#favorites-only').prop('checked', false);
    displayProperties(allProperties);
  });

  // 6. View Details button (Event Delegation for dynamically created buttons)
  let selectedPropertyTitle = '';

  $('#property-list').on('click', '.view-details-btn', function () {
    const propertyId = Number($(this).data('id'));
    const property = allProperties.find(function (item) {
      return item.id === propertyId;
    });

    if (!property) return;

    const detailsHtml = `
      <img src="${property.image}" alt="${property.title}" class="modal-property-img mb-3">
      <h4>${property.title}</h4>
      <p class="text-muted mb-2"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${property.location} &bull; ${property.type}</p>
      <p class="fs-4 fw-bold text-primary mb-2">$${property.price.toLocaleString()}</p>
      <p class="mb-2">
        <strong>Bedrooms:</strong> ${property.bedrooms} |
        <strong>Bathrooms:</strong> ${property.bathrooms} |
        <strong>Area:</strong> ${property.area} sq ft
      </p>
      <p class="mb-0">${property.description}</p>
    `;

    selectedPropertyTitle = property.title;

    $('#modal-details').html(detailsHtml);
    $('#inquiry-form')[0].reset();
    $('#inquiry-property-context').text(`Inquiring about: ${property.title}`);
    $('#user-message').val(`Hi, I am interested in "${property.title}". Could you share more details?`);
    $('#name-error, #email-error, #message-error').text('');
    $('#form-success').hide();

    // Open the Bootstrap Modal
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('propertyModal'));
    modal.show();
  });

  // 7. Client-side Form Validation for the Inquiry Form
  $('#inquiry-form').on('submit', function (e) {
    e.preventDefault(); // Stop the page from reloading

    const name = $('#user-name').val().trim();
    const email = $('#user-email').val().trim();
    const message = $('#user-message').val().trim();

    // Clear old error messages
    $('#name-error').text('');
    $('#email-error').text('');
    $('#message-error').text('');
    $('#form-success').hide();

    let isValid = true;

    if (name.length < 2) {
      $('#name-error').text('Please enter your name (at least 2 characters).');
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      $('#email-error').text('Please enter a valid email address.');
      isValid = false;
    }

    if (message.length < 10) {
      $('#message-error').text('Please enter a message (at least 10 characters).');
      isValid = false;
    }

    if (isValid) {
      $('#form-success')
        .text(`Thank you! Your inquiry about "${selectedPropertyTitle}" has been sent.`)
        .show();
      this.reset(); // Clear form fields after successful submit
    }
  });

  // Retry button re-fetches properties if AJAX fails
  $('#retry-btn').on('click', fetchProperties);

  // Run on page load
  updateFavCount();
  fetchProperties();
});
