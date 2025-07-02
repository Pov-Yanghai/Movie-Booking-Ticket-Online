# MovieBook - Cinema Ticket Booking System


A modern cinema ticket booking platform built with React.js, featuring real-time seat selection, movie listings, and promotional management.
## FrontEnd 
## Table of Contents
-Features
-Installation
-Usage
-Technologies Used
-Folder Structure
-License
-Contact
## Features
- 🎥 **Movie Listings**: Display films with Khmer/English titles, prices, and showtimes
- 💺 **Interactive Seat Booking**: Visual seat map with real-time availability
- 📱 **Mobile-First Design**: Fully responsive across all devices
- 🎫 **Promotion System**: Highlight special offers and discounts
- 📞 **Contact Portal**: Dedicated support channels for users and partners
- 🔄 **Auto-Rotating Banners**: Promotional content carousel

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Pov-Yanghai/Frontend_Final_Project.git
2. Install dependencies
   npm install
   npm install react router-dom 
4. Install icon
   npm install react-icons
   npm install @heroicons/react
5. Start the development server:
   npm run dev
   
## Usage
  1. Browse Movies: Navigate through current and upcoming films
  2. Select Seats:
    -Choose available seats (green)
    -Avoid booked seats (red)
    -Confirm selection with user details
  3. View Promotions: Check special offers in movie cards
  4. Contact Support: Use the dedicated contact form or hotline
## Technologies Used
  -React 18 + Vite
  -React Router 6
  -Heroicons
  -Date-fns (date handling)
  -Responsive Design (Flexbox/Grid)
## Folder Structure
moviebook/
├── public/
│   └── images/           # Movie posters & banners
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header/      # HEader for page
│   │   ├── Body/        # Body stores Movies and with other pages 
│   │   └── Footer/       # Footer to apply all pages in our web page 
│   ├── pages/            # Route-specific views
│   ├── data/             # Movie dataset (movies.js)
│   └── App.jsx           # Root component
|   |__ App.css         ## Global Styles
|   |__ index.jsx     ## Entry point
|_______index.html     ## Main HTML file 

## Exampple of Our Web page   
 Home	   Movies    Booking	   Contact  
       Movies container 
          Footer 

## Contact
 Development Team
📧 Team4@company.com
📞 +855 96 7817889

Cinema Partnerships
📧 CADT@moviebook.kh
📞 +855 87 888 045


## BackEnd