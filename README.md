# Older Than When

A time perception visualizer that shows how our sense of time changes as we age. This tool creates comparisons like "The Lord of the Rings movies are now older than Star Wars was when you were 10."

## About

This interactive visualization helps you understand how your perception of time shifts as you age by finding and displaying pairs of events where:

1. One event (recent) occurred after your reference age
2. Another event (older) occurred before your reference age
3. The recent event is now further in the past than the older event was at your reference age


## Features

- Interactive timeline showing event relationships
- Separate cultural and historical event categories
- Accurate time calculations
- Customizable birth year and reference age

## How to Use

1. Enter your birth year
2. Set your reference age (when you were X years old)
3. Choose between "Cultural Events" or "Historical Events"
4. Select specific categories you're interested in
5. Click "Visualize Time Perception"
6. View the generated comparisons on the timeline
7. Click "Generate More Comparisons" for additional pairings

## Events Data Structure

Events are stored in `events.json` and follow this structure:

```json
{
  "cultural": {
    "category_name": [
      { "name": "Event Name", "year": 1985 },
      { "name": "Another Event", "year": 1990 }
    ]
  },
  "historical": {
    "category_name": [
      { "name": "Event Name", "year": 1945 },
      { "name": "Another Event", "year": 1970 }
    ]
  }
}
```

### Top-level categories

The JSON file has two top-level categories:

1. `cultural` - Entertainment and cultural phenomena
2. `historical` - Major historical and technological events

### Sub-categories

Each top-level category contains sub-categories. Current sub-categories include:

**Cultural:**
- `movies` - Film releases and milestones
- `music` - Albums, songs and music industry events
- `tv_shows` - Television series premieres and milestones
- `games` - Video game releases and industry milestones
- `fashion` - Fashion trends and iconic styles

**Historical:**
- `politics` - Political events and milestones
- `technology` - Technological innovations and releases
- `sports` - Major sporting events and achievements
- `world_events` - Global historical events

### Event Format

Each event must have:
- `name` (string): Descriptive name of the event
- `year` (number): Year the event occurred (integer)

## How to Add Events

1. Open `events.json`
2. Find the appropriate category and sub-category
3. Add a new event object with the required fields:

```json
{ "name": "Your New Event", "year": 2000 }
```

4. Make sure to maintain proper JSON syntax (commas between items, etc.)
5. Save the file

## Adding New Categories

To add a new category:

1. Open `events.json`
2. Decide if it belongs under "cultural" or "historical"
3. Add a new category key with an array of event objects:

```json
"your_new_category": [
  { "name": "First Event", "year": 1990 },
  { "name": "Second Event", "year": 2005 }
]
```

4. Save the file

## Deployment

This is a static web application that can be deployed on GitHub Pages or any web hosting service. No server-side code is required.

## License

MIT

## Acknowledgments

Inspired by the human tendency to perceive time differently as we age, and the realization that events from our youth are now more distant than historical events once were.