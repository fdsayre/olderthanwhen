// Load events and render vertical side-by-side timelines
(async function() {
  // Fetch event data
  let eventData;
  try {
    const resp = await fetch('events.json');
    eventData = await resp.json();
  } catch (e) {
    console.error('Error loading events.json:', e);
    return;
  }

  // Default user parameters
  let birthYear = 1981;
  let indexAge = 10;
  let referenceYear = birthYear + indexAge;
  const currentYear = new Date().getFullYear();
  
  // Event category selections
  let selectedCategories = {
    cultural: {
      movies: true,
      music: true,
      tv_shows: true,
      games: true,
      fashion: true
    },
    historical: {
      politics: true,
      technology: true,
      sports: true,
      world_events: true
    }
  };

  // Get DOM elements
  const birthYearInput = document.getElementById('birthYear');
  const indexAgeInput = document.getElementById('indexAge');
  const updateButton = document.getElementById('updateVisualization');
  const categoryCheckboxes = document.querySelectorAll('.category-checkbox');

  // Initialize with default values
  birthYearInput.value = birthYear;
  indexAgeInput.value = indexAge;
  
  // Add event listeners for category checkboxes
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const category = this.dataset.category;
      const subcategory = this.dataset.subcategory;
      selectedCategories[category][subcategory] = this.checked;
      updateVisualization();
    });
  });

  // Function to get filtered events based on selected categories
  function getFilteredEvents() {
    const filteredEvents = [];
    
    for (const category in selectedCategories) {
      for (const subcategory in selectedCategories[category]) {
        if (selectedCategories[category][subcategory] && eventData[category] && eventData[category][subcategory]) {
          // Add category and subcategory info to each event for styling
          const eventsWithCategory = eventData[category][subcategory].map(event => ({
            ...event,
            category,
            subcategory
          }));
          filteredEvents.push(...eventsWithCategory);
        }
      }
    }
    
    // Sort events chronologically
    return filteredEvents.sort((a, b) => a.year - b.year);
  }
  
  // Function to update visualization
  function updateVisualization() {
    // Get current values from inputs
    birthYear = parseInt(birthYearInput.value);
    indexAge = parseInt(indexAgeInput.value);
    referenceYear = birthYear + indexAge;
    
    // Validate inputs
    if (isNaN(birthYear) || isNaN(indexAge) || 
        birthYear < 1900 || birthYear > currentYear ||
        indexAge < 1 || indexAge > 100) {
      alert('Please enter valid values for birth year and index age.');
      return;
    }

    // Set headers
    document.getElementById('pastHeader').textContent = `When You Were ${indexAge} (${referenceYear})`;
    document.getElementById('presentHeader').textContent = `Now (${currentYear})`;

    // Clear containers
    const pastContainer = document.getElementById('pastEvents');
    const presentContainer = document.getElementById('presentEvents');
    pastContainer.innerHTML = '';
    presentContainer.innerHTML = '';

    // Create year labels containers
    const pastLabelsContainer = document.createElement('div');
    pastLabelsContainer.className = 'year-labels-container';
    pastContainer.appendChild(pastLabelsContainer);
    
    const presentLabelsContainer = document.createElement('div');
    presentLabelsContainer.className = 'year-labels-container';
    presentContainer.appendChild(presentLabelsContainer);

    // Get filtered events
    const allEvents = getFilteredEvents();
    
    // Filter events for past timeline (only events before or during the reference year)
    const pastEvents = allEvents.filter(event => event.year <= referenceYear);
    
    // Filter events for present timeline (all events)
    const presentEvents = [...allEvents];
    
    // Calculate the maximum number of years to display
    const maxYearsBack = 30; // Display 30 years back from each reference point
    const yearSpacing = 30; // 30px between years
    
    // Add year markers and labels
    for (let i = 0; i <= maxYearsBack; i++) {
      // Add year marker for every year (as a horizontal line)
      const pastYearMarker = document.createElement('div');
      pastYearMarker.className = 'year-marker';
      if (i % 5 === 0 || i === 1 || i === 10 || i === 20) {
        pastYearMarker.className += ' highlighted';
      }
      pastYearMarker.style.top = `${i * yearSpacing}px`;
      pastContainer.appendChild(pastYearMarker);
      
      const presentYearMarker = document.createElement('div');
      presentYearMarker.className = 'year-marker';
      if (i % 5 === 0 || i === 1 || i === 10 || i === 20) {
        presentYearMarker.className += ' highlighted';
      }
      presentYearMarker.style.top = `${i * yearSpacing}px`;
      presentContainer.appendChild(presentYearMarker);
      
      // Add labels for years (outside the main timeline area)
      if (i === 0 || i === 1 || i === 5 || i === 10 || i === 15 || i === 20 || i === 25 || i === 30) {
        // Past timeline year label
        const pastYearLabel = document.createElement('div');
        pastYearLabel.className = 'year-label';
        if (i === 0 || i === 10 || i === 20 || i === 30) {
          pastYearLabel.className += ' highlighted';
        }
        pastYearLabel.style.top = `${i * yearSpacing}px`;
        
        // Format the label
        if (i === 0) {
          pastYearLabel.textContent = 'Now';
        } else if (i === 1) {
          pastYearLabel.textContent = '-1 year';
        } else {
          pastYearLabel.textContent = `-${i} years`;
        }
        
        pastLabelsContainer.appendChild(pastYearLabel);
        
        // Present timeline year label
        const presentYearLabel = document.createElement('div');
        presentYearLabel.className = 'year-label';
        if (i === 0 || i === 10 || i === 20 || i === 30) {
          presentYearLabel.className += ' highlighted';
        }
        presentYearLabel.style.top = `${i * yearSpacing}px`;
        
        // Format the label
        if (i === 0) {
          presentYearLabel.textContent = 'Now';
        } else if (i === 1) {
          presentYearLabel.textContent = '-1 year';
        } else {
          presentYearLabel.textContent = `-${i} years`;
        }
        
        presentLabelsContainer.appendChild(presentYearLabel);
      }
    }
    
    // Generate the years array for both timelines
    const pastYears = [];
    const presentYears = [];
    
    for (let i = 0; i <= maxYearsBack; i++) {
      pastYears.push(referenceYear - i);
      presentYears.push(currentYear - i);
    }
    
    // Function to create a group for events from the same year
    function createYearEventsGroup(year, container, events, timeline) {
      const yearPosition = Math.abs(timeline === 'past' ? 
        referenceYear - year : 
        currentYear - year) * yearSpacing;
      
      // Create a group for the year's events
      const yearGroup = document.createElement('div');
      yearGroup.className = 'year-events-group';
      yearGroup.style.top = `${yearPosition}px`;
      yearGroup.dataset.year = year;
      container.appendChild(yearGroup);
      
      // Add events to the group with consistent positioning
      events.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.style.top = '0';
        
        // Add category marker for color coding
        const categoryMarker = document.createElement('div');
        categoryMarker.className = `event-category-marker category-${event.category}-${event.subcategory}`;
        eventElement.appendChild(categoryMarker);
        
        if (timeline === 'past') {
          eventElement.innerHTML += `
            <div class="event-label"><strong>${event.name}</strong></div>
            <div class="event-year">(${event.year})</div>
            <div class="event-dot"></div>
          `;
        } else {
          eventElement.innerHTML += `
            <div class="event-dot"></div>
            <div class="event-year">(${event.year})</div>
            <div class="event-label"><strong>${event.name}</strong></div>
          `;
        }
        
        yearGroup.appendChild(eventElement);
      });
      
      // Add hover behavior to the group
      yearGroup.addEventListener('mouseenter', () => {
        // Calculate the offset for each event in the group
        const events = yearGroup.querySelectorAll('.event');
        const offsetPerEvent = 5;
        const startOffset = -((events.length - 1) * offsetPerEvent) / 2;
        
        events.forEach((event, index) => {
          const offset = startOffset + (index * offsetPerEvent);
          event.style.transform = `translateY(${offset}px)`;
        });
      });
      
      yearGroup.addEventListener('mouseleave', () => {
        // Reset all events
        const events = yearGroup.querySelectorAll('.event');
        events.forEach(event => {
          event.style.transform = 'translateY(0)';
        });
      });
    }
    
    // Group events by year for past timeline
    const pastEventsByYear = {};
    pastEvents.forEach(event => {
      if (!pastEventsByYear[event.year]) {
        pastEventsByYear[event.year] = [];
      }
      pastEventsByYear[event.year].push(event);
    });
    
    // Render past timeline events grouped by year
    Object.keys(pastEventsByYear).forEach(year => {
      createYearEventsGroup(parseInt(year), pastContainer, pastEventsByYear[year], 'past');
    });
    
    // Group events by year for present timeline
    const presentEventsByYear = {};
    presentEvents.forEach(event => {
      if (!presentEventsByYear[event.year]) {
        presentEventsByYear[event.year] = [];
      }
      presentEventsByYear[event.year].push(event);
    });
    
    // Render present timeline events grouped by year
    Object.keys(presentEventsByYear).forEach(year => {
      createYearEventsGroup(parseInt(year), presentContainer, presentEventsByYear[year], 'present');
    });
    
    // Set minimum height for containers to accommodate all years
    const containerHeight = (maxYearsBack + 1) * yearSpacing + 100; // Add extra padding
    pastContainer.style.minHeight = `${containerHeight}px`;
    presentContainer.style.minHeight = `${containerHeight}px`;
  }

  // Add event listener for update button
  updateButton.addEventListener('click', updateVisualization);
  
  // Initial render
  updateVisualization();
})();