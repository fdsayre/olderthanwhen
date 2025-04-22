// Bar chart visualization for olderthanwhen
document.addEventListener('DOMContentLoaded', function() {
    // Expose the createBarVisualization function globally
    window.createBarVisualization = createBarVisualization;
});

// Create bar chart visualization
function createBarVisualization(birthYear, referenceAge, comparisons) {
    // Clear existing content
    const barVisualization = document.getElementById('barVisualization');
    barVisualization.innerHTML = '';
    
    if (!comparisons || comparisons.length === 0) {
        barVisualization.innerHTML = '<div class="empty-message">No comparisons to display. Try generating some!</div>';
        return;
    }
    
    // Calculate reference year
    const referenceYear = birthYear + referenceAge;
    const currentYear = new Date().getFullYear();
    
    // For each comparison, create a bar chart
    comparisons.forEach((comparison, index) => {
        const { recentEvent, olderEvent, yearsSinceRecent, yearsBetweenOlderAndRef } = comparison;
        
        // Create container for this comparison
        const container = document.createElement('div');
        container.className = 'comparison-bar-container';
        
        // Add title
        const title = document.createElement('div');
        title.className = 'bar-title';
        title.textContent = `"${recentEvent.name}" vs "${olderEvent.name}"`;
        container.appendChild(title);
        
        // Create "Then" bar (reference age perspective)
        const thenBarContainer = document.createElement('div');
        thenBarContainer.className = 'time-bar-container';
        
        const thenLabel = document.createElement('div');
        thenLabel.className = 'bar-label';
        thenLabel.textContent = `When you were ${referenceAge}:`;
        thenBarContainer.appendChild(thenLabel);
        
        const thenBar = document.createElement('div');
        thenBar.className = 'time-bar';
        
        // Calculate total range for "Then" timeline
        const thenTotalYears = referenceYear - (birthYear - 5);
        
        // Add birth marker
        addMarker(thenBar, 'birth', birthYear, `Birth (${birthYear})`, birthYear - 5, thenTotalYears);
        
        // Add older event marker
        addMarker(thenBar, 'older', olderEvent.year, `${olderEvent.name} (${olderEvent.year})`, birthYear - 5, thenTotalYears);
        
        // Add reference age marker
        addMarker(thenBar, 'reference', referenceYear, `Age ${referenceAge} (${referenceYear})`, birthYear - 5, thenTotalYears);
        
        // Add time span
        addTimeSpan(thenBar, olderEvent.year, referenceYear, `${yearsBetweenOlderAndRef} yrs`, 'then-span', birthYear - 5, thenTotalYears);
        
        thenBarContainer.appendChild(thenBar);
        container.appendChild(thenBarContainer);
        
        // Create "Now" bar (current perspective)
        const nowBarContainer = document.createElement('div');
        nowBarContainer.className = 'time-bar-container';
        
        const nowLabel = document.createElement('div');
        nowLabel.className = 'bar-label';
        nowLabel.textContent = "Today's perspective:";
        nowBarContainer.appendChild(nowLabel);
        
        const nowBar = document.createElement('div');
        nowBar.className = 'time-bar';
        
        // Calculate total range for "Now" timeline
        const nowTotalYears = currentYear - (referenceYear - 5);
        
        // Add reference age marker
        addMarker(nowBar, 'reference', referenceYear, `Age ${referenceAge} (${referenceYear})`, referenceYear - 5, nowTotalYears);
        
        // Add recent event marker
        addMarker(nowBar, 'recent', recentEvent.year, `${recentEvent.name} (${recentEvent.year})`, referenceYear - 5, nowTotalYears);
        
        // Add current year marker
        addMarker(nowBar, 'now', currentYear, `Today (${currentYear})`, referenceYear - 5, nowTotalYears);
        
        // Add time span
        addTimeSpan(nowBar, recentEvent.year, currentYear, `${yearsSinceRecent} yrs`, 'now-span', referenceYear - 5, nowTotalYears);
        
        nowBarContainer.appendChild(nowBar);
        container.appendChild(nowBarContainer);
        
        // Add comparison summary
        const summary = document.createElement('div');
        summary.className = 'comparison-summary';
        
        if (yearsSinceRecent > yearsBetweenOlderAndRef) {
            summary.innerHTML = `
                "${recentEvent.name}" is now ${yearsSinceRecent} years old, which is 
                <strong>${yearsSinceRecent - yearsBetweenOlderAndRef} years longer</strong> than
                "${olderEvent.name}" was when you were ${referenceAge}.
            `;
        } else if (yearsSinceRecent === yearsBetweenOlderAndRef) {
            summary.innerHTML = `
                "${recentEvent.name}" is now ${yearsSinceRecent} years old, which is
                <strong>exactly the same age</strong> as
                "${olderEvent.name}" was when you were ${referenceAge}.
            `;
        } else {
            summary.innerHTML = `
                "${recentEvent.name}" is now ${yearsSinceRecent} years old, which is
                <strong>${yearsBetweenOlderAndRef - yearsSinceRecent} years shorter</strong> than
                "${olderEvent.name}" was when you were ${referenceAge}.
            `;
        }
        
        container.appendChild(summary);
        barVisualization.appendChild(container);
    });
}

// Helper function to add a marker to a timeline bar
function addMarker(barElement, type, year, label, startYear, totalYears) {
    const position = ((year - startYear) / totalYears) * 100;
    
    // Skip if position is outside the bar
    if (position < 0 || position > 100) return;
    
    const marker = document.createElement('div');
    marker.className = `event-marker ${type}`;
    marker.style.left = `${position}%`;
    
    const labelElement = document.createElement('div');
    labelElement.className = 'event-label';
    labelElement.style.left = `${position}%`;
    labelElement.textContent = label;
    
    barElement.appendChild(marker);
    barElement.appendChild(labelElement);
}

// Helper function to add a time span to a timeline bar
function addTimeSpan(barElement, startPoint, endPoint, label, className, startYear, totalYears) {
    const startPosition = ((startPoint - startYear) / totalYears) * 100;
    const endPosition = ((endPoint - startYear) / totalYears) * 100;
    
    // Skip if completely outside the bar
    if (endPosition < 0 || startPosition > 100) return;
    
    // Adjust positions if partially outside
    const adjustedStart = Math.max(0, startPosition);
    const adjustedEnd = Math.min(100, endPosition);
    const width = adjustedEnd - adjustedStart;
    
    const span = document.createElement('div');
    span.className = `time-span ${className || ''}`;
    span.style.left = `${adjustedStart}%`;
    span.style.width = `${width}%`;
    
    const spanLabel = document.createElement('div');
    spanLabel.className = 'time-span-label';
    spanLabel.textContent = label;
    span.appendChild(spanLabel);
    
    barElement.appendChild(span);
}