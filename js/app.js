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
        displayProperties(allProperties);
      },
      error: function () {
        $('#loading-msg').hide();
        $('#error-msg').show();
      }
    });
  }

  // 2. Render properties dynamically into the #property-list container
  function displayProperties(properties) {
    const $list = $('#property-list');
    $list.empty(); // Clear previous items before rendering

    if (properties.length === 0) {
      $('#no-results-msg').show();
      return;
    }

    $('#no-results-msg').hide();

    properties.forEach(function (property) {
      const cardHtml = `
        <div class="property-card" style="border: 1px solid #ccc; padding: 12px; margin-bottom: 12px;">
          <img src="${property.image}" alt="${property.title}" width="260">
          <h4>${property.title}</h4>
          <p><strong>Location:</strong> ${property.location}</p>
          <p><strong>Price:</strong> $${property.price.toLocaleString()}</p>
          <p><strong>Bedrooms:</strong> ${property.bedrooms} | <strong>Bathrooms:</strong> ${property.bathrooms}</p>
          <button type="button" class="view-details-btn" data-id="${property.id}">View Details</button>
        </div>
      `;

      $list.append(cardHtml);
    });
  }

  // 3. Filter properties using all active criteria (keyword, location, bedrooms, max price)
  function filterProperties() {
    const keyword = $('#search-input').val().toLowerCase().trim();
    const location = $('#location-filter').val();
    const bedrooms = $('#bedroom-filter').val();
    const maxPrice = $('#price-filter').val();

    const filtered = allProperties.filter(function (property) {
      const matchesKeyword =
        keyword === '' ||
        property.title.toLowerCase().includes(keyword) ||
        property.location.toLowerCase().includes(keyword);

      const matchesLocation =
        location === '' || property.location === location;

      const matchesBedrooms =
        bedrooms === '' ||
        (bedrooms === '4'
          ? property.bedrooms >= 4
          : property.bedrooms === Number(bedrooms));

      const matchesPrice =
        maxPrice === '' || property.price <= Number(maxPrice);

      return matchesKeyword && matchesLocation && matchesBedrooms && matchesPrice;
    });

    displayProperties(filtered);
  }

  // 4. Event listeners for live search & multi-criteria filtering (no page reload)
  $('#search-input, #price-filter').on('input', filterProperties);
  $('#location-filter, #bedroom-filter').on('change', filterProperties);

  // 5. Reset button clears all inputs and shows all properties again
  $('#reset-btn').on('click', function () {
    $('#search-input').val('');
    $('#location-filter').val('');
    $('#bedroom-filter').val('');
    $('#price-filter').val('');
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
      <img src="${property.image}" alt="${property.title}" width="320">
      <h4>${property.title}</h4>
      <p><strong>Type:</strong> ${property.type} | <strong>Location:</strong> ${property.location}</p>
      <p><strong>Price:</strong> $${property.price.toLocaleString()}</p>
      <p><strong>Bedrooms:</strong> ${property.bedrooms} | <strong>Bathrooms:</strong> ${property.bathrooms} | <strong>Area:</strong> ${property.area} sq ft</p>
      <p>${property.description}</p>
    `;

    $('#modal-details').html(detailsHtml);
    $('#form-success').hide();

    // Scroll down to the details section (in the next step, this opens a Bootstrap Modal)
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
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
