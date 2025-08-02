# Yu-Gi-Oh! Card Showcase 🃏

A modern, responsive web application for exploring and discovering Yu-Gi-Oh! trading cards. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Live Demo

[➡️ View the live application](https://yugioh-showcase.vercel.app)

## 🌟 Features

### 🔍 **Advanced Search & Filtering**
- Search cards by name with intelligent suggestions
- Filter by card type, attribute, race, level, and archetype
- Search history with persistent storage
- Real-time results with pagination

### ❤️ **Favorites Management**
- Add/remove cards from favorites with one click
- Export favorites list as JSON
- Session-based storage (persists during browser session)
- Dedicated favorites page with management tools

### 📱 **Responsive Design**
- Mobile-first approach
- Optimized for tablets and desktop
- Touch-friendly interactions
- Adaptive layouts for different screen sizes

### ⚡ **Performance Optimized**
- API response caching for faster loading
- Image optimization with Next.js
- Lazy loading and efficient rendering
- Minimal bundle size with tree shaking

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: [YugiohProDeck API](https://ygoprodeck.com/api-guide)
- **Storage**: Browser localStorage & sessionStorage
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Baramrd/yugioh-showcase.git
cd yugioh-showcase
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🌐 API Integration

This project uses the [YugiohProDeck API](https://ygoprodeck.com/api-guide) which provides:

- **10,000+ Yu-Gi-Oh! cards** with detailed information
- **High-quality card images** in multiple resolutions
- **Real-time market prices** from major retailers
- **Set information** and card variants
- **No API key required** - completely free to use

### API Features Used:
- Card search with multiple parameters
- Individual card lookup by ID
- Random card selection
- Comprehensive card data including:
  - Names, descriptions, and effects
  - Attack/Defense values and levels
  - Card types, attributes, and races
  - Archetype information
  - Market pricing data
  - Set and rarity information

## 🙏 Acknowledgments

- **YugiohProDeck** for providing the comprehensive API
- **Konami** for the Yu-Gi-Oh! Trading Card Game
- **Vercel** for Next.js and deployment platform
- **Tailwind CSS** for the utility-first CSS framework
---
