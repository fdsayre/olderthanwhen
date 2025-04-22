// Current year
const currentYear = new Date().getFullYear();
let eventData = null;

// DOM elements
const eventTypeSelect = document.getElementById('eventType');
const categoriesSelect = document.getElementById('eventCategories');
const visualizeBtn = document.getElementById('visualize');
const generateMoreBtn = document.getElementById('generateMore');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const timelineDiv = document.getElementById('timeline');
const comparisonsDiv = document.getElementById('comparisons');

// Store comparisons generated globally so they can be accessed by all visualization methods
window.comparisons = [];

// Event listeners
eventTypeSelect.addEventListener('change', updateCategories);
visualizeBtn.addEventListener('click', generateVisualization);
generateMoreBtn.addEventListener('click', addMoreComparisons);

// Add event listener for the page load to ensure vertical view is set
window.addEventListener('load', function() {
    console.log('Main script load event triggered');
    setTimeout(function() {
        // Try to find and click the vertical view button
        const verticalViewBtn = document.getElementById('verticalViewBtn');
        if (verticalViewBtn) {
            console.log('Clicking vertical view button from load event');
            verticalViewBtn.click();
        }
    }, 500);
});

// Initialize the app
async function init() {
    document.getElementById('birthYear').setAttribute('max', currentYear - 5);
    const defaultBirthYear = 1981;
    document.getElementById('birthYear').value = defaultBirthYear;
    
    // Fallback event data in case fetch fails
    const fallbackData = {
        cultural: {
            movies: [
                { name: "Star Wars: A New Hope", year: 1977 },
                { name: "E.T. the Extra-Terrestrial", year: 1982 },
                { name: "Back to the Future", year: 1985 },
                { name: "Jurassic Park", year: 1993 },
                { name: "The Lion King", year: 1994 },
                { name: "Toy Story", year: 1995 },
                { name: "Titanic", year: 1997 },
                { name: "The Matrix", year: 1999 },
                { name: "The Lord of the Rings: Fellowship", year: 2001 },
                { name: "Finding Nemo", year: 2003 },
                { name: "The Dark Knight", year: 2008 },
                { name: "Avatar", year: 2009 },
                { name: "Frozen", year: 2013 },
                { name: "Star Wars: The Force Awakens", year: 2015 },
                { name: "Avengers: Endgame", year: 2019 }
            ],
            music: [
                { name: "The Beatles' first album", year: 1963 },
                { name: "Elvis' last performance", year: 1977 },
                { name: "Michael Jackson's 'Thriller'", year: 1982 },
                { name: "Madonna's 'Like a Virgin'", year: 1984 },
                { name: "Nirvana's 'Nevermind'", year: 1991 },
                { name: "Spice Girls' debut single", year: 1996 },
                { name: "Britney Spears' '...Baby One More Time'", year: 1999 },
                { name: "iPod release", year: 2001 },
                { name: "Lady Gaga's 'Poker Face'", year: 2008 },
                { name: "Taylor Swift's '1989'", year: 2014 },
                { name: "BTS' international breakthrough", year: 2018 }
            ],
            tv_shows: [
                { name: "I Love Lucy premiere", year: 1951 },
                { name: "Star Trek original series", year: 1966 },
                { name: "Saturday Night Live premiere", year: 1975 },
                { name: "The Simpsons premiere", year: 1989 },
                { name: "Friends premiere", year: 1994 },
                { name: "Breaking Bad premiere", year: 2008 },
                { name: "Game of Thrones premiere", year: 2011 },
                { name: "Stranger Things premiere", year: 2016 }
            ],
            games: [
                { name: "Pong", year: 1972 },
                { name: "Space Invaders", year: 1978 },
                { name: "Pac-Man", year: 1980 },
                { name: "Super Mario Bros.", year: 1985 },
                { name: "Sonic the Hedgehog", year: 1991 },
                { name: "PlayStation release", year: 1994 },
                { name: "Pokemon Red & Blue", year: 1996 },
                { name: "Half-Life", year: 1998 },
                { name: "Grand Theft Auto III", year: 2001 },
                { name: "World of Warcraft", year: 2004 },
                { name: "Wii release", year: 2006 },
                { name: "Minecraft", year: 2011 },
                { name: "Fortnite", year: 2017 }
            ],
            fashion: [
                { name: "Miniskirts become popular", year: 1965 },
                { name: "Punk fashion emerges", year: 1975 },
                { name: "Madonna's 'Material Girl' look", year: 1984 },
                { name: "Grunge fashion peak", year: 1992 },
                { name: "Low-rise jeans trend", year: 2000 },
                { name: "Athleisure becomes mainstream", year: 2014 }
            ]
        },
        historical: {
            politics: [
                { name: "End of World War II", year: 1945 },
                { name: "Cuban Missile Crisis", year: 1962 },
                { name: "JFK Assassination", year: 1963 },
                { name: "Nixon resignation", year: 1974 },
                { name: "Berlin Wall fall", year: 1989 },
                { name: "Nelson Mandela's release", year: 1990 },
                { name: "9/11 Attacks", year: 2001 },
                { name: "Barack Obama election", year: 2008 },
                { name: "Brexit referendum", year: 2016 },
                { name: "COVID-19 pandemic begins", year: 2020 }
            ],
            technology: [
                { name: "First electronic computer (ENIAC)", year: 1945 },
                { name: "Moon landing", year: 1969 },
                { name: "First personal computer", year: 1975 },
                { name: "Sony Walkman release", year: 1979 },
                { name: "First commercial cell phone", year: 1983 },
                { name: "World Wide Web invented", year: 1989 },
                { name: "Windows 95 release", year: 1995 },
                { name: "Google founded", year: 1998 },
                { name: "Facebook launch", year: 2004 },
                { name: "First iPhone release", year: 2007 },
                { name: "Instagram launch", year: 2010 },
                { name: "ChatGPT release", year: 2022 }
            ],
            sports: [
                { name: "First Super Bowl", year: 1967 },
                { name: "Muhammad Ali's first title", year: 1964 },
                { name: "Miracle on Ice", year: 1980 },
                { name: "Michael Jordan's first title", year: 1991 },
                { name: "Tiger Woods' first Masters win", year: 1997 },
                { name: "Usain Bolt's world record", year: 2009 },
                { name: "Leicester City's Premier League win", year: 2016 }
            ],
            world_events: [
                { name: "United Nations founded", year: 1945 },
                { name: "First human in space", year: 1961 },
                { name: "Chernobyl disaster", year: 1986 },
                { name: "Indian Ocean tsunami", year: 2004 },
                { name: "Global financial crisis", year: 2008 },
                { name: "Arab Spring begins", year: 2010 },
                { name: "Paris Climate Agreement", year: 2015 }
            ]
        }
    };

    // Load events from external JSON file
    try {
        // Check if we're running from a server (http/https) or from file system
        if (window.location.protocol.includes('http')) {
            // Running from a server, use fetch
            const response = await fetch('events.json');
            if (!response.ok) {
                throw new Error(`Failed to load events: ${response.status} ${response.statusText}`);
            }
            eventData = await response.json();
            console.log("Successfully loaded events.json via fetch");
        } else {
            // Running from file system, use XMLHttpRequest as a fallback
            // This works better with local files in some browsers
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'events.json', false);  // Synchronous for simplicity
            try {
                xhr.send();
                if (xhr.status === 200) {
                    eventData = JSON.parse(xhr.responseText);
                    console.log("Successfully loaded events.json via XMLHttpRequest");
                } else {
                    throw new Error(`Failed to load events: ${xhr.status}`);
                }
            } catch (xhrError) {
                throw new Error("XMLHttpRequest failed");
            }
        }
    } catch (error) {
        // Fall back to embedded data if all methods fail
        console.error('Error loading events.json:', error);
        console.log("Using embedded fallback data instead");
        eventData = fallbackData;
    }
    
    // Update categories once data is loaded
    updateCategories();
}

// Update categories based on event type selection
function updateCategories() {
    if (!eventData) {
        console.log("Event data not loaded yet");
        return; // Wait until data is loaded
    }
    console.log("Event data loaded successfully:", Object.keys(eventData));
    
    const eventType = eventTypeSelect.value;
    categoriesSelect.innerHTML = '';
    
    const categories = Object.keys(eventData[eventType]);
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = formatCategoryName(category);
        option.selected = true;
        categoriesSelect.appendChild(option);
    });
}

// Format category name for display
function formatCategoryName(category) {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Generate visualization
function generateVisualization() {
    loadingDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    
    setTimeout(() => {
        const birthYear = parseInt(document.getElementById('birthYear').value);
        const indexAge = parseInt(document.getElementById('indexAge').value);
        
        // Validate inputs
        if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear - 5) {
            alert(`Please enter a valid birth year between 1900 and ${currentYear - 5}`);
            loadingDiv.style.display = 'none';
            return;
        }
        
        if (isNaN(indexAge) || indexAge < 5 || indexAge > 80) {
            alert('Please enter a valid age between 5 and 80');
            loadingDiv.style.display = 'none';
            return;
        }
        
        // Calculate reference year
        const referenceYear = birthYear + indexAge;
        
        // Reset comparisons and visualization
        window.comparisons = [];
        timelineDiv.innerHTML = '';
        comparisonsDiv.innerHTML = '';
        
        // Reset all visualization containers
        const verticalVisualization = document.getElementById('verticalVisualization');
        if (verticalVisualization) {
            verticalVisualization.innerHTML = '';
        }
        
        const barVisualization = document.getElementById('barVisualization');
        if (barVisualization) {
            barVisualization.innerHTML = '';
        }
        
        // Create timeline
        createTimeline(birthYear, referenceYear);
        
        // Generate comparisons
        addMoreComparisons();
        
        // Show results
        loadingDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
        
        // If there are toggle buttons, simulate click on vertical view button
        const verticalViewBtn = document.getElementById('verticalViewBtn');
        if (verticalViewBtn) {
            console.log('Clicking vertical view button after visualization');
            verticalViewBtn.click();
        } else {
            console.log('Vertical view button not found, will try later');
            // Try again after a short delay
            setTimeout(function() {
                const retryBtn = document.getElementById('verticalViewBtn');
                if (retryBtn) {
                    console.log('Clicking vertical view button (retry)');
                    retryBtn.click();
                }
            }, 300);
        }
    }, 500);
}

// Create timeline visualization
function createTimeline(birthYear, referenceYear) {
    // Calculate timeline range (from 20 years before birth to current year)
    const startYear = birthYear - 20;
    const endYear = currentYear;
    const timelineRange = endYear - startYear;
    
    // Add year markers
    for (let i = 0; i <= 10; i++) {
        const year = startYear + Math.round((timelineRange / 10) * i);
        const position = i * 10;
        
        const yearMarker = document.createElement('div');
        yearMarker.className = 'year-marker';
        yearMarker.style.left = `${position}%`;
        yearMarker.textContent = year;
        timelineDiv.appendChild(yearMarker);
    }
    
    // Add birth year marker
    const birthPosition = ((birthYear - startYear) / timelineRange) * 100;
    
    const birthMarker = document.createElement('div');
    birthMarker.className = 'birth-marker';
    birthMarker.style.left = `${birthPosition}%`;
    birthMarker.style.top = '-40px';
    birthMarker.style.height = '80px';
    
    const birthLabel = document.createElement('div');
    birthLabel.className = 'birth-label';
    birthLabel.style.left = `${birthPosition}%`;
    birthLabel.textContent = `Birth Year (${birthYear})`;
    
    // Add "Now" marker
    const nowMarker = document.createElement('div');
    nowMarker.className = 'marker';
    nowMarker.style.left = '100%';
    nowMarker.style.top = '-40px';
    nowMarker.style.height = '80px';
    
    const nowLabel = document.createElement('div');
    nowLabel.className = 'marker-label';
    nowLabel.style.left = '100%';
    nowLabel.textContent = `Now (${currentYear})`;
    
    // Add "Then" marker (when you were X years old)
    const thenPosition = ((referenceYear - startYear) / timelineRange) * 100;
    
    const thenMarker = document.createElement('div');
    thenMarker.className = 'marker';
    thenMarker.style.left = `${thenPosition}%`;
    thenMarker.style.top = '-40px';
    thenMarker.style.height = '80px';
    
    const thenLabel = document.createElement('div');
    thenLabel.className = 'marker-label';
    thenLabel.style.left = `${thenPosition}%`;
    thenLabel.textContent = `When you were ${document.getElementById('indexAge').value} (${referenceYear})`;
    
    timelineDiv.appendChild(birthMarker);
    timelineDiv.appendChild(birthLabel);
    timelineDiv.appendChild(nowMarker);
    timelineDiv.appendChild(nowLabel);
    timelineDiv.appendChild(thenMarker);
    timelineDiv.appendChild(thenLabel);
}

// Add more event pair comparisons
function addMoreComparisons() {
    if (!eventData) return; // Wait until data is loaded
    
    const birthYear = parseInt(document.getElementById('birthYear').value);
    const indexAge = parseInt(document.getElementById('indexAge').value);
    const referenceYear = birthYear + indexAge;
    const eventType = eventTypeSelect.value;
    
    // Get selected categories
    const selectedCategories = Array.from(categoriesSelect.selectedOptions).map(option => option.value);
    
    if (selectedCategories.length === 0) {
        alert('Please select at least one category');
        return;
    }
    
    // Calculate timeline range
    const startYear = birthYear - 20;
    const timelineRange = currentYear - startYear;
    
    // Gather eligible events
    let eligibleRecentEvents = [];
    let eligibleOlderEvents = [];
    
    selectedCategories.forEach(category => {
        const events = eventData[eventType][category];
        if (events) {
            events.forEach(event => {
                // Recent events: between reference year and 5 years ago
                if (event.year > referenceYear && event.year < currentYear - 5) {
                    eligibleRecentEvents.push({...event, category});
                } 
                // Older events: between 20 years before birth and 5 years before reference
                else if (event.year < referenceYear - 5 && event.year > startYear) {
                    eligibleOlderEvents.push({...event, category});
                }
            });
        }
    });
    
    // Shuffle arrays for random selection
    shuffleArray(eligibleRecentEvents);
    shuffleArray(eligibleOlderEvents);
    
    // Generate up to 20 new comparisons
    const maxToAdd = 20;
    let added = 0;
    
    // Group events by years to avoid tight overlaps
    const yearGroups = new Map();
    
    for (let i = 0; i < eligibleRecentEvents.length && added < maxToAdd; i++) {
        const recentEvent = eligibleRecentEvents[i];
        const yearsSinceRecent = currentYear - recentEvent.year;
        
        // Find matching older events
        for (let j = 0; j < eligibleOlderEvents.length; j++) {
            const olderEvent = eligibleOlderEvents[j];
            const yearsBetweenOlderAndRef = referenceYear - olderEvent.year;
            
            // Check if time spans match (within 3 years)
            if (Math.abs(yearsSinceRecent - yearsBetweenOlderAndRef) < 3) {
                // Check if we already have this comparison
                const isDuplicate = window.comparisons.some(comp => 
                    (comp.recentEvent.name === recentEvent.name && comp.olderEvent.name === olderEvent.name) ||
                    (comp.recentEvent.name === olderEvent.name && comp.olderEvent.name === recentEvent.name)
                );
                
                if (isDuplicate) continue;
                
                // Check if these years are already too clustered on the timeline
                const recentYearKey = `${recentEvent.year}`;
                const olderYearKey = `${olderEvent.year}`;
                
                if ((yearGroups.get(recentYearKey) || 0) >= 2 || (yearGroups.get(olderYearKey) || 0) >= 2) {
                    // Skip if we already have 2 events in this year to avoid overcrowding
                    continue;
                }
                
                // Update year groups counter
                yearGroups.set(recentYearKey, (yearGroups.get(recentYearKey) || 0) + 1);
                yearGroups.set(olderYearKey, (yearGroups.get(olderYearKey) || 0) + 1);
                
                // Double-check calculations for accuracy
                const yearsSinceRecentExact = currentYear - recentEvent.year;
                const yearsBetweenOlderAndRefExact = referenceYear - olderEvent.year;
                
                // Add to visualization with validated calculations
                addComparisonToTimeline(
                    recentEvent, 
                    olderEvent, 
                    referenceYear, 
                    startYear, 
                    timelineRange,
                    yearsSinceRecentExact,
                    yearsBetweenOlderAndRefExact
                );
                
                // Store comparison with validated calculations
                window.comparisons.push({
                    recentEvent,
                    olderEvent,
                    yearsSinceRecent: yearsSinceRecentExact,
                    yearsBetweenOlderAndRef: yearsBetweenOlderAndRefExact
                });
                
                // Remove to avoid duplicates
                eligibleOlderEvents.splice(j, 1);
                added++;
                break;
            }
        }
    }
    
    // Show message if no comparisons found
    if (added === 0) {
        if (window.comparisons.length === 0) {
            comparisonsDiv.innerHTML = `
                <div class="event-comparison">
                    <p>No matching comparisons found for your birth year and age.</p>
                    <p>Try selecting different categories or changing your age parameters.</p>
                </div>
            `;
        } else {
            alert("No more comparisons available. Try changing your parameters or selecting different categories.");
        }
        
        generateMoreBtn.style.display = 'none';
    } else if (added < maxToAdd) {
        // Hide button if we've found all possible comparisons
        generateMoreBtn.style.display = 'none';
    }
}

// Add event pair comparison to the timeline
function addComparisonToTimeline(recentEvent, olderEvent, referenceYear, startYear, timelineRange, yearsSinceRecent, yearsBetweenOlderAndRef) {
    // Calculate positions
    const recentPosition = ((recentEvent.year - startYear) / timelineRange) * 100;
    const olderPosition = ((olderEvent.year - startYear) / timelineRange) * 100;
    
    // Calculate vertical positions with staggering
    // Use the event's position in the array to determine vertical position
    const recentTopOffset = -40 - (comparisons.length % 3) * 30; // Stagger -40, -70, -100 pixels
    const olderTopOffset = 40 + (comparisons.length % 3) * 30;  // Stagger 40, 70, 100 pixels
    
    // Create connecting line
    const line = document.createElement('div');
    line.className = 'event-pair-line';
    line.style.left = `${recentPosition}%`;
    line.style.top = `${recentTopOffset}px`;
    line.style.height = `${olderTopOffset - recentTopOffset}px`;
    
    // Create recent event
    const recentEventEl = document.createElement('div');
    recentEventEl.className = `event ${eventTypeSelect.value}-event`;
    recentEventEl.style.left = `${recentPosition}%`;
    
    const recentDot = document.createElement('div');
    recentDot.className = 'event-dot';
    recentDot.style.top = `${recentTopOffset}px`;
    recentDot.title = `${recentEvent.name} (${recentEvent.year})`;
    
    const recentLabel = document.createElement('div');
    recentLabel.className = 'event-label';
    recentLabel.style.top = `${recentTopOffset - 40}px`;
    recentLabel.innerHTML = `${recentEvent.name}<span class="event-year">${recentEvent.year}</span>`;
    
    recentEventEl.appendChild(recentDot);
    recentEventEl.appendChild(recentLabel);
    
    // Create older event
    const olderEventEl = document.createElement('div');
    olderEventEl.className = `event ${eventTypeSelect.value}-event`;
    olderEventEl.style.left = `${olderPosition}%`;
    
    const olderDot = document.createElement('div');
    olderDot.className = 'event-dot';
    olderDot.style.top = `${olderTopOffset}px`;
    olderDot.title = `${olderEvent.name} (${olderEvent.year})`;
    
    const olderLabel = document.createElement('div');
    olderLabel.className = 'event-label';
    olderLabel.style.top = `${olderTopOffset + 10}px`;
    olderLabel.innerHTML = `${olderEvent.name}<span class="event-year">${olderEvent.year}</span>`;
    
    olderEventEl.appendChild(olderDot);
    olderEventEl.appendChild(olderLabel);
    
    // Add to timeline
    timelineDiv.appendChild(line);
    timelineDiv.appendChild(recentEventEl);
    timelineDiv.appendChild(olderEventEl);
    
    // Add comparison text with accurate calculations
    const comparisonDiv = document.createElement('div');
    comparisonDiv.className = 'event-comparison';
    comparisonDiv.innerHTML = `
        <strong>"${recentEvent.name}" (${recentEvent.year})</strong> is now ${yearsSinceRecent} years ago, 
        which is longer ago than <strong>"${olderEvent.name}" (${olderEvent.year})</strong> was when you were ${document.getElementById('indexAge').value} 
        (${yearsBetweenOlderAndRef} years before).
    `;
    
    comparisonsDiv.appendChild(comparisonDiv);
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the app
window.onload = init;