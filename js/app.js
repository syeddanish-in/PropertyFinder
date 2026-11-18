$(document).ready(function () {
  // Store all fetched properties here so we can filter them later without re-fetching
  let allProperties = [];

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
    const $list = $('#property-list');
    $list.empty(); // Clear previous items before rendering

    // Update live results counter
    $('#results-count').text(`Showing ${properties.length} of ${allProperties.length} properties`);

    if (properties.length === 0) {
      $('#no-results-msg').show();
      return;
    }

    $('#no-results-msg').hide();

    properties.forEach(function (property) {
      const featuredBadge = property.featured
        ? '<span class="badge bg-warning text-dark ms-2">Featured</span>'
        : '';

      const cardHtml = `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 property-card shadow-sm">
            <img src="${property.image}" class="card-img-top" alt="${property.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${property.title}${featuredBadge}</h5>
              <p class="text-muted mb-1">${property.location} &bull; ${property.type}</p>
              <p class="fs-5 fw-bold text-primary mb-2">$${property.price.toLocaleString()}</p>
              <p class="card-text small text-secondary">
                ${property.bedrooms} Beds &bull; ${property.bathrooms} Baths &bull; ${property.area} sq ft
              </p>
              <button type="button" class="btn btn-outline-primary mt-auto view-details-btn" data-id="${property.id}">
                View Details
              </button>
            </div>
          </div>
        </div>
      `;

      $list.append(cardHtml);
    });
  }

  // 3. Filter properties using all active criteria
  function filterProperties() {
    const keyword = $('#search-input').val().toLowerCase().trim();
    const location = $('#location-filter').val();
    const type = $('#type-filter').val();
    const bedrooms = $('#bedroom-filter').val();
    const minPrice = $('#min-price-filter').val();
    const maxPrice = $('#price-filter').val();

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

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesType &&
        matchesBedrooms &&
        matchesMinPrice &&
        matchesMaxPrice
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

  // 4. Event listeners for live search & multi-criteria filtering (no page reload)
  $('#search-input, #min-price-filter, #price-filter').on('input', filterProperties);
  $('#location-filter, #type-filter, #bedroom-filter, #sort-filter').on('change', filterProperties);

  // 5. Reset button clears all inputs and shows all properties again
  $('#reset-btn').on('click', function () {
    $('#search-input').val('');
    $('#location-filter').val('');
    $('#type-filter').val('');
    $('#bedroom-filter').val('');
    $('#min-price-filter').val('');
    $('#price-filter').val('');
    $('#sort-filter').val('default');
    displayProperties(allProperties);
  });

  // 6. View Details button (Event Delegation for dynamically created buttons)
  $('#property-list').on('click', '.view-details-btn', function () {
    const propertyId = Number($(this).data('id'));
    const property = allProperties.find(function (item) {
      return item.id === propertyId;
    });

    if (!property) return;

    const detailsHtml = `
      <img src="${property.image}" alt="${property.title}" class="modal-property-img mb-3">
      <h4>${property.title}</h4>
      <p class="text-muted mb-2">${property.type} &bull; ${property.location}</p>
      <p class="fs-4 fw-bold text-primary mb-2">$${property.price.toLocaleString()}</p>
      <p class="mb-2">
        <strong>Bedrooms:</strong> ${property.bedrooms} |
        <strong>Bathrooms:</strong> ${property.bathrooms} |
        <strong>Area:</strong> ${property.area} sq ft
      </p>
      <p class="mb-0">${property.description}</p>
    `;

    $('#modal-details').html(detailsHtml);
    $('#inquiry-form')[0].reset();
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
      $('#form-success').show();
      this.reset(); // Clear form fields after successful submit
    }
  });

  // Run on page load
  fetchProperties();
});
