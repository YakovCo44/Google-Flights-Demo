# Google Flights Demo

Google Flights Demo is a React-based web application that replicates the core functionalities of Google Flights. It allows users to search for flights, view available options, and explore travel routes using an interactive map.

## Features

- **Flight Search:** Enter departure and destination locations to find available flights.
- **Interactive Map:** Uses `react-leaflet` and `leaflet` to display flight routes.
- **Date Picker:** Users can select travel dates using `@mui/x-date-pickers`.
- **Responsive Design:** Ensures compatibility across different screen sizes.
- **API Integration:** Fetches real-time flight data using the Sky Scraper API from RapidAPI.

## Technologies Used

- **React 18.2.0** – Frontend framework
- **React Router** – Page navigation
- **Material UI (MUI)** – UI components
- **Leaflet & React-Leaflet** – Interactive maps
- **Date-FNS** – Date formatting
- **Sky Scraper API (RapidAPI)** – Flight search API

## Installation & Setup

### Prerequisites
- Install [Node.js](https://nodejs.org/) (recommended version 18+)
- Install npm or yarn

### Clone the Repository
```sh
git clone https://github.com/YakovCo44/Google-Flights-Demo.git
cd Google-Flights-Demo
```

### Install Dependencies
```sh
npm install
```

### Start Development Server
```sh
npm run dev
```
This will start a local development server. Open `http://localhost:5173/` in your browser.

## Deployment

The project is deployed using **GitHub Pages**.

### Deploy Steps
1. **Build the Project**
   ```sh
   npm run build
   ```
2. **Deploy to GitHub Pages**
   ```sh
   npm run deploy
   ```

## Troubleshooting

### 404 Error on GitHub Pages
If you encounter a **404 error**, ensure that:
- The `homepage` field in `package.json` is correctly set to:
  ```json
  "homepage": "https://yakovco44.github.io/Google-Flights-Demo/"
  ```
- The correct branch (`gh-pages`) is selected in GitHub Pages settings.

### React Routing Issues
If your routes are not working correctly after deployment, add this to `public/index.html`:
```html
<meta http-equiv="refresh" content="0;url=/" />
```

## Contribution
If you'd like to contribute, feel free to fork the repository and submit a pull request.

## Author
**Yakov Cohen**  
GitHub: [YakovCo44](https://github.com/YakovCo44)

