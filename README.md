# GeekByte Website

A modern, responsive static website for GeekByte - your premier technology solutions partner.

## Project Overview

This is a professional static website built with HTML5, CSS3, and vanilla JavaScript. The site features a clean, modern design with full mobile responsiveness and follows web development best practices.

## Features

- **Responsive Design**: Fully responsive layout that works seamlessly across desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth transitions and animations
- **Mobile Navigation**: Hamburger menu for mobile devices with smooth toggle animations
- **Contact Form**: Functional contact form with client-side validation
- **SEO Optimized**: Proper meta tags, semantic HTML, and structure for search engine optimization
- **Accessibility**: Built with accessibility in mind using semantic HTML5 elements
- **Cross-browser Compatible**: Works across all modern browsers

## Project Structure

```
geekbyte.biz/
├── index.html          # Main homepage
├── about.html          # About page
├── contact.html        # Contact page with form
├── css/
│   └── style.css       # Main stylesheet with responsive design
├── js/
│   └── main.js         # JavaScript for interactivity
├── images/             # Directory for images and assets
├── .claude/
│   └── agents/         # Directory for Claude sub-agents
└── README.md           # Project documentation
```

## Pages

### Home (index.html)
- Hero section with call-to-action
- Services overview with feature cards
- Clean navigation header
- Professional footer

### About (about.html)
- Company information
- Mission statement
- Core values
- Why choose us section

### Contact (contact.html)
- Contact form with validation
- Business contact information
- Business hours
- Form submission handling

## Technologies Used

- **HTML5**: Semantic markup and modern HTML features
- **CSS3**: Custom properties (CSS variables), Flexbox, Grid, animations
- **JavaScript (ES6+)**: Modern vanilla JavaScript for interactivity
- **No frameworks**: Pure HTML/CSS/JS for maximum performance and minimal dependencies

## CSS Features

- CSS custom properties for theming
- Mobile-first responsive design
- Flexbox and Grid layouts
- Smooth transitions and hover effects
- Box shadow and modern styling
- Breakpoints for responsive design (768px, 480px)

## JavaScript Features

- Mobile navigation toggle
- Contact form validation
- Smooth scrolling
- Active page highlighting
- Form submission handling (ready for backend integration)
- Utility functions (debounce, viewport detection)

## Getting Started

### Prerequisites

No build process or dependencies required! This is a static website that runs directly in any modern web browser.

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser

### Deployment

This static website can be deployed to any web hosting service:

- **GitHub Pages**: Push to GitHub and enable Pages
- **Netlify**: Drag and drop the folder or connect to Git
- **Vercel**: Deploy with zero configuration
- **Traditional hosting**: Upload files via FTP to your web server

## Customization

### Colors

Edit CSS custom properties in `css/style.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #3b82f6;
    /* ... more variables */
}
```

### Content

- Edit HTML files directly to change text content
- Update meta tags in each HTML file for SEO
- Replace placeholder contact information

### Images

- Add images to the `images/` directory
- Update image references in HTML files
- Use appropriate alt text for accessibility

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Contact Form Integration

The contact form currently uses client-side validation and a simulated submission. To integrate with a backend:

1. Uncomment the fetch code in `js/main.js` (line 75-92)
2. Update the API endpoint URL
3. Set up backend service (e.g., Node.js, PHP, or serverless function)
4. Configure email service or database storage

## Performance

- No external dependencies or frameworks
- Minimal CSS and JavaScript
- Optimized for fast loading
- Mobile-first approach

## Future Enhancements

- Add blog section
- Implement portfolio/projects page
- Add testimonials section
- Integrate analytics
- Add more interactive elements
- Implement dark mode toggle

## License

Copyright © 2025 GeekByte. All rights reserved.

## Support

For questions or support, please contact: info@geekbyte.biz

---

Built with modern web technologies and best practices.
