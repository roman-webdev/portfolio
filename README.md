# Roman — Developer Portfolio

A personal portfolio website showcasing selected development projects, built with HTML, CSS and JavaScript.

## Live Demo

[View the portfolio](https://roman-webdev.vercel.app/)

## About

This static website introduces Roman and presents selected work in web development and Telegram automation. It brings project previews, an about section, services and a GitHub contact link together in a responsive, multilingual interface.

## Featured Projects

- **HELIXPRIMUS** — AI Customer Operations Platform: triage, policy matching, human-approved replies, analytics, SLA and audit. FastAPI, React, TypeScript, SQLAlchemy/Alembic, PostgreSQL-ready and deterministic AI provider abstraction. EN / RU / UA. Portfolio Release Candidate / demo-grade; synthetic data, mock AI and mock delivery. [Source](https://github.com/roman-webdev/HELIXPRIMUS).

- **MANOR (MANOR HOUSE)** — A barbershop booking and management system.
- **DriveFix** — An auto service website for presenting services and handling customer inquiries.
- **SmartSave Beta 1.3.14** — Release Candidate / Beta Deployment: a UA / EN / RU Telegram finance assistant with income/expense tracking, budgets, goals, CSV imports, insights and recovery. 454 automated tests passed, 0 skipped. Linux / Oracle Linux beta deployment; native Oracle Linux regression, Telegram live acceptance and journal/service verification remain pending before production readiness. Its public repository is documentation/showcase-only.

These are projects showcased by the portfolio; the portfolio itself is a static website.

## Tech Stack

- **HTML** — Page structure and content.
- **CSS** — Responsive layout, styling and animations.
- **JavaScript** — Language switching and interactive behavior.
- **Git & GitHub** — Version control and the deployment source.
- **Vercel** — Production hosting.

## Features

- Responsive layout for desktop, tablet and mobile screens.
- English, Russian and Ukrainian language switcher (EN / RU / UA).
- Animations and interactive page elements.
- Project previews for MANOR, DriveFix and SmartSave.
- Section navigation and mobile menu.
- SEO metadata, Open Graph tags and a favicon.

## Project Structure

```text
portfolio/
├── index.html     # Main page and metadata
├── style.css      # Layout, styling and animations
├── script.js      # Translations and interactions
├── images/        # Project preview images
├── favicon.ico    # Browser tab icon
└── README.md      # Project documentation
```

## Run Locally

1. Clone the repository:

   ```sh
   git clone https://github.com/roman-webdev/portfolio.git
   cd portfolio
   ```

2. Open `index.html` in your browser.

For development, you can also serve the project folder with a local static server, such as the Live Server extension in VS Code.

No dependency installation or build step is required.

## Deployment

The portfolio is hosted on Vercel and connected to the GitHub repository. Updates pushed to the `main` branch trigger an automatic production deployment.

The workflow is: edit locally → commit changes → push to GitHub → Vercel deploys the updated website.

## Author / Contact

**Roman** — [GitHub profile](https://github.com/roman-webdev)
