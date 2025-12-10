import { useState, useEffect } from 'react'
import './App.css'
import logo from './assets/images/logo.png'
import fruitsImage from './assets/images/pictures/fruits.png'
import backgroundImage from './assets/images/pictures/background.png'
import ellipseImage from './assets/images/vector/ellipse.png'
import appleImage from './assets/images/vector/apple.png'
import fruityImage from './assets/images/pictures/fruity.png'
import diaryImage from './assets/images/pictures/diary.png'
import staplesImage from './assets/images/pictures/staples.png'
import snacksImage from './assets/images/pictures/snacks.png'
import householdImage from './assets/images/pictures/household.png'
import tomatoesImage from './assets/images/pictures/tomatoes.png'
import masromImage from './assets/images/pictures/masrom.png'
import orangeImage from './assets/images/pictures/orange.png'
import kiwiImage from './assets/images/pictures/kiwi.png'
import juiceImage from './assets/images/pictures/juice.png'
import guavaImage from './assets/images/pictures/guava.png'
import delightImage from './assets/images/pictures/delight.png'
import avocadoImage from './assets/images/pictures/avocado.png'
import honeyImage from './assets/images/pictures/honey.png'
import fruitsComboImage from './assets/images/products/fruits.png'
import vegetablePackImage from './assets/images/products/vegies.png'
import staplesKitImage from './assets/images/products/grains.png'
import dairyPackImage from './assets/images/products/milk.png'
import snacksComboImage from './assets/images/products/munchies.png'
import breakfastImage from './assets/images/products/breakfast.png'
import healthKitImage from './assets/images/products/health.png'
import bakeryImage from './assets/images/products/bakery.png'
import plantsImage from './assets/images/pictures/plants.png'
import testimonial1Image from './assets/images/testimonials/man.png'
import testimonial2Image from './assets/images/testimonials/second_man.png'

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 676,
    hours: 8,
    minutes: 3,
    seconds: 20
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        }
        
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <img src={logo} alt="MarketGreen Logo" />
            <span className="logo-text">
              <span className="logo-market">Market</span>
              <span className="logo-green">Green</span>
            </span>
          </div>
          
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#shop">Shop +</a>
            <a href="#news">News +</a>
            <a href="#collections">Collections</a>
            <a href="#contact">Contact</a>
          </nav>
          
          <div className="header-actions">
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="currentColor"/>
                <path d="M10 12C5.58172 12 2 13.7909 2 16V20H18V16C18 13.7909 14.4183 12 10 12Z" fill="currentColor"/>
              </svg>
            </button>
            <button className="icon-btn cart-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1H3L3.4 3M5 11H15L19 3H3.4M5 11L3.4 3M5 11L2.70711 13.2929C2.07714 13.9229 2.52331 15 3.41421 15H15M15 15C13.8954 15 13 15.8954 13 17C13 18.1046 13.8954 19 15 19C16.1046 19 17 18.1046 17 17C17 15.8954 16.1046 15 15 15ZM7 17C7 18.1046 6.10457 19 5 19C3.89543 19 3 18.1046 3 17C3 15.8954 3.89543 15 5 15C6.10457 15 7 15.8954 7 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="cart-badge">5</span>
            </button>
            <button className="shop-now-btn">SHOP NOW</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" style={{ '--bg-image': `url(${backgroundImage})` }}>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <img src={appleImage} alt="Apple" className="apple-icon" />
              <span>100% genuine Products</span>
            </div>
            <h1 className="hero-title">
              Fresh Groceries, Delivered to Your Doorstep<span className="truck-icon">🚚</span>
            </h1>
            <div className="hero-description-wrapper">
              <div className="hero-divider"></div>
              <p className="hero-description">
                Enjoy hassle-free online grocery shopping with fast delivery and the best quality products
              </p>
            </div>
            <button className="explore-btn">EXPLORE PRODUCTS</button>
          </div>
          
          <div className="hero-image-container">
            <div className="hero-image-wrapper"></div>
            <img src={ellipseImage} alt="" className="hero-ellipse-shadow" />
            <img src={fruitsImage} alt="Fresh Groceries" className="hero-fruits-image" />
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="features-banner">
        <div className="features-container">
          <span className="features-title">Find Everything You Need, Fresh & Fast</span>
          <div className="features-divider">|</div>
          <div className="features-list">
            <div className="feature-item">
              <img src={appleImage} alt="Apple" className="feature-icon" />
              <span>Fresh Groceries</span>
            </div>
            <div className="features-divider">|</div>
            <div className="feature-item">
              <span className="feature-icon">!</span>
              <span>Daily Needs</span>
            </div>
            <div className="features-divider">|</div>
            <div className="feature-item">
              <span className="feature-icon">+</span>
              <span>Pantry Essentials</span>
            </div>
            <div className="features-divider">|</div>
            <div className="feature-item">
              <span className="feature-icon">🏃</span>
              <span>Healthy Living</span>
            </div>
            <div className="features-divider">|</div>
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <span>Quick Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Indicators */}
      <div className="carousel-indicators">
        <div className="indicator active"></div>
        <div className="indicator"></div>
      </div>

      {/* Product Categories Section */}
      <section className="product-categories">
        <div className="categories-container">
          {/* Top Row */}
          <div className="categories-row">
            <div className="category-card category-fresh">
              <div className="category-content">
                <h2 className="category-title">FRESH PRODUCE</h2>
                <p className="category-description">FRUITS, VEGETABLES, AND ORGANIC FARM-FRESH ITEMS.</p>
                <button className="category-shop-btn">SHOP NOW</button>
              </div>
              <div className="category-image-wrapper">
                <img src={fruityImage} alt="Fresh Produce" className="category-image" />
              </div>
            </div>

            <div className="category-card category-dairy">
              <div className="category-content">
                <h2 className="category-title">DAIRY & EGGS</h2>
                <p className="category-description">MILK, CHEESE, YOGURT, BUTTER, AND FRESH EGGS.</p>
                <button className="category-shop-btn">SHOP NOW</button>
              </div>
              <div className="category-image-wrapper">
                <img src={diaryImage} alt="Dairy & Eggs" className="category-image" />
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="categories-row">
            <div className="category-card category-staples">
              <div className="category-content">
                <h2 className="category-title">STAPLES & ESSENTIALS</h2>
                <p className="category-description">RICE, FLOUR, PULSES, SPICES, AND COOKING OILS.</p>
                <button className="category-shop-btn">SHOP NOW</button>
              </div>
              <div className="category-image-wrapper">
                <img src={staplesImage} alt="Staples & Essentials" className="category-image" />
              </div>
            </div>

            <div className="category-card category-snacks">
              <div className="category-content">
                <h2 className="category-title">SNACKS & BEVERAGES</h2>
                <p className="category-description">CHIPS, BISCUITS, SOFT DRINKS, JUICES, AND TEA/COFFEE.</p>
                <button className="category-shop-btn">SHOP NOW</button>
              </div>
              <div className="category-image-wrapper">
                <img src={snacksImage} alt="Snacks & Beverages" className="category-image" />
              </div>
            </div>

            <div className="category-card category-household">
              <div className="category-content">
                <h2 className="category-title">HOUSEHOLD & PERSONAL CARE</h2>
                <p className="category-description">CLEANING SUPPLIES & HYGIENE PRODUCTS.</p>
                <button className="category-shop-btn">SHOP NOW</button>
              </div>
              <div className="category-image-wrapper">
                <img src={householdImage} alt="Household & Personal Care" className="category-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Trendy Products Section */}
      <section className="trendy-products">
        <div className="trendy-products-container">
          <h2 className="trendy-products-title">OUR TRENDY PRODUCTS</h2>
          
          <nav className="products-nav">
            <a href="#food-drinks" className="nav-link active">FOOD & DRINKS</a>
            <span className="nav-divider">|</span>
            <a href="#vegetables" className="nav-link">VEGETABLES</a>
            <span className="nav-divider">|</span>
            <a href="#dried-foods" className="nav-link">DRIED FOODS</a>
            <span className="nav-divider">|</span>
            <a href="#bread-cake" className="nav-link">BREAD & CAKE</a>
            <span className="nav-divider">|</span>
            <a href="#fish-meat" className="nav-link">FISH & MEAT</a>
          </nav>

          <div className="products-grid">
            {/* Row 1 */}
            <div className="product-card">
              <div className="product-image-wrapper">
                <img src={tomatoesImage} alt="Red Hot Tomato" className="product-image" />
                <span className="product-badge badge-new">NEW</span>
              </div>
              <div className="product-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <h3 className="product-name">Red Hot Tomato</h3>
              <div className="product-price">
                <span className="current-price">$118.26</span>
                <span className="original-price">$162.00</span>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-wrapper">
                <img src={juiceImage} alt="Vegetables Juices" className="product-image" />
                <span className="product-badge badge-new">NEW</span>
              </div>
              <div className="product-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <h3 className="product-name">Vegetables Juices</h3>
              <div className="product-price">
                <span className="current-price">$68.00</span>
                <span className="original-price">$85.00</span>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-wrapper">
                <img src={orangeImage} alt="Orange Fresh Juice" className="product-image" />
                <span className="product-badge badge-hot">HOT</span>
              </div>
              <div className="product-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <h3 className="product-name">Orange Fresh Juice</h3>
              <div className="product-price">
                <span className="current-price">$73.60</span>
                <span className="original-price">$92.00</span>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-wrapper">
                <img src={delightImage} alt="Dairy Delight Pack" className="product-image" />
                <span className="product-badge badge-new">NEW</span>
              </div>
              <div className="product-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <h3 className="product-name">Dairy Delight Pack</h3>
              <div className="product-price">
                <span className="current-price">$58.50</span>
                <span className="original-price">$78.00</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="product-card">
              <div className="product-image-wrapper">
                <img src={avocadoImage} alt="Avocado" className="product-image" />
                <span className="product-badge badge-new">NEW</span>
              </div>
              <div className="product-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <h3 className="product-name">Avocado</h3>
              <div className="product-price">
                <span className="current-price">$68.00</span>
                <span className="original-price">$85.00</span>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-wrapper">
                <img src={guavaImage} alt="Guava" className="product-image" />
                <span className="product-badge badge-hot">HOT</span>
              </div>
              <div className="product-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <h3 className="product-name">Guava</h3>
              <div className="product-price">
                <span className="current-price">$73.60</span>
                <span className="original-price">$92.00</span>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-wrapper">
                <img src={masromImage} alt="Masrom" className="product-image" />
                <span className="product-badge badge-new">NEW</span>
              </div>
              <div className="product-rating">
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <h3 className="product-name">Masrom</h3>
              <div className="product-price">
                <span className="current-price">$58.50</span>
                <span className="original-price">$78.00</span>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-wrapper">
                <img src={kiwiImage} alt="Kiwi" className="product-image" />
                <span className="product-badge badge-sell">SELL -25%</span>
              </div>
              <div className="product-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <h3 className="product-name">Kiwi</h3>
              <div className="product-price">
                <span className="current-price">$135.00</span>
                <span className="original-price">$180.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Deal Section */}
      <section className="hot-deal">
        <div className="hot-deal-container">
          <div className="hot-deal-image-wrapper">
            <img src={honeyImage} alt="Honey Combo Package" className="hot-deal-image" />
          </div>
          
          <div className="hot-deal-content">
            <p className="hot-deal-label">// Todays Hot Deals</p>
            <p className="hot-deal-stock">ORIGINAL STOCK</p>
            <h2 className="hot-deal-title">HONEY COMBO PACKAGE</h2>
            
            <div className="countdown-timer">
              <div className="timer-item">
                <div className="timer-circle">
                  <span className="timer-number">{String(timeLeft.days).padStart(3, '0')}</span>
                </div>
                <span className="timer-label">DAYS</span>
              </div>
              <div className="timer-item">
                <div className="timer-circle">
                  <span className="timer-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                </div>
                <span className="timer-label">HRS</span>
              </div>
              <div className="timer-item">
                <div className="timer-circle">
                  <span className="timer-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                </div>
                <span className="timer-label">MINS</span>
              </div>
              <div className="timer-item">
                <div className="timer-circle">
                  <span className="timer-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
                <span className="timer-label">SECS</span>
              </div>
            </div>
            
            <button className="hot-deal-btn">SHOP NOW</button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="featured-products-container">
          <h2 className="featured-products-title">Featured Products</h2>
          
          <div className="featured-grid">
            {/* Row 1 */}
            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src={fruitsComboImage} alt="Fresh Fruits Combo" className="featured-image" />
                <span className="featured-badge badge-new">NEW</span>
              </div>
              <h3 className="featured-name">Fresh Fruits Combo</h3>
              <div className="featured-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="featured-price">
                <span className="current-price">$118.26</span>
                <span className="original-price">$162.00</span>
              </div>
            </div>

            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src={vegetablePackImage} alt="Vegetable Essentials Pack" className="featured-image" />
                <span className="featured-badge badge-new">NEW</span>
              </div>
              <h3 className="featured-name">Vegetable Essentials Pack</h3>
              <div className="featured-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="featured-price">
                <span className="current-price">$68.00</span>
                <span className="original-price">$85.00</span>
              </div>
            </div>

            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src={staplesKitImage} alt="Organic Staples Kit" className="featured-image" />
                <span className="featured-badge badge-hot">HOT</span>
              </div>
              <h3 className="featured-name">Organic Staples Kit</h3>
              <div className="featured-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="featured-price">
                <span className="current-price">$73.60</span>
                <span className="original-price">$92.00</span>
              </div>
            </div>

            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src={dairyPackImage} alt="Dairy Delight Pack" className="featured-image" />
                <span className="featured-badge badge-new">NEW</span>
              </div>
              <h3 className="featured-name">Dairy Delight Pack</h3>
              <div className="featured-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="featured-price">
                <span className="current-price">$58.50</span>
                <span className="original-price">$78.00</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src={snacksComboImage} alt="Snacks & Munchies Combo" className="featured-image" />
                <span className="featured-badge badge-new">NEW</span>
              </div>
              <h3 className="featured-name">Snacks & Munchies Combo</h3>
              <div className="featured-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="featured-price">
                <span className="current-price">$68.00</span>
                <span className="original-price">$85.00</span>
              </div>
            </div>

            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src={breakfastImage} alt="Breakfast Essentials" className="featured-image" />
                <span className="featured-badge badge-hot">HOT</span>
              </div>
              <h3 className="featured-name">Breakfast Essentials</h3>
              <div className="featured-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="featured-price">
                <span className="current-price">$73.60</span>
                <span className="original-price">$92.00</span>
              </div>
            </div>

            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src={healthKitImage} alt="Healthy Living Kit" className="featured-image" />
                <span className="featured-badge badge-new">NEW</span>
              </div>
              <h3 className="featured-name">Healthy Living Kit</h3>
              <div className="featured-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="featured-price">
                <span className="current-price">$58.50</span>
                <span className="original-price">$78.00</span>
              </div>
            </div>

            <div className="featured-card">
              <div className="featured-image-wrapper">
                <img src={bakeryImage} alt="Bakery Favorites" className="featured-image" />
                <span className="featured-badge badge-sell">SELL -25%</span>
              </div>
              <h3 className="featured-name">Bakery Favorites</h3>
              <div className="featured-rating">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <div className="featured-price">
                <span className="current-price">$135.00</span>
                <span className="original-price">$180.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Hero Section */}
      <section className="video-hero">
        <div className="video-hero-container">
          <div className="video-wrapper">
            <img src={plantsImage} alt="Gardening Video" className="video-placeholder" />
            <button className="play-button">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="30" fill="white" opacity="0.9"/>
                <path d="M25 20L25 40L40 30L25 20Z" fill="#4CAF50"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <p className="testimonials-label">// TESTIMONIALS</p>
            <h2 className="testimonials-title">Clients Feedbacks.</h2>
          </div>

          <div className="testimonials-wrapper">
            <button className="scroll-arrow scroll-arrow-left" onClick={() => {
              const scrollContainer = document.querySelector('.testimonials-scroll');
              if (scrollContainer) {
                scrollContainer.scrollBy({ left: -450, behavior: 'smooth' });
              }
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="testimonials-scroll">
            <div className="testimonial-card">
              <div className="testimonial-image-wrapper">
                <img src={testimonial1Image} alt="Noah Alexander" className="testimonial-image" />
              </div>
              <div className="testimonial-content">
                <div className="testimonial-quote-icon">💬</div>
                <p className="testimonial-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="testimonial-author">
                  <h4 className="testimonial-name">Noah Alexander</h4>
                  <p className="testimonial-role">Professor</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image-wrapper">
                <img src={testimonial2Image} alt="Jacob William" className="testimonial-image" />
              </div>
              <div className="testimonial-content">
                <div className="testimonial-quote-icon">💬</div>
                <p className="testimonial-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="testimonial-author">
                  <h4 className="testimonial-name">Jacob William</h4>
                  <p className="testimonial-role">Founder, Browni Co.</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image-wrapper">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" alt="Michael Johnson" className="testimonial-image" />
              </div>
              <div className="testimonial-content">
                <div className="testimonial-quote-icon">💬</div>
                <p className="testimonial-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="testimonial-author">
                  <h4 className="testimonial-name">Michael Johnson</h4>
                  <p className="testimonial-role">Chef, Green Kitchen</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image-wrapper">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" alt="Sarah Martinez" className="testimonial-image" />
              </div>
              <div className="testimonial-content">
                <div className="testimonial-quote-icon">💬</div>
                <p className="testimonial-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="testimonial-author">
                  <h4 className="testimonial-name">Sarah Martinez</h4>
                  <p className="testimonial-role">Nutritionist</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image-wrapper">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" alt="David Chen" className="testimonial-image" />
              </div>
              <div className="testimonial-content">
                <div className="testimonial-quote-icon">💬</div>
                <p className="testimonial-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="testimonial-author">
                  <h4 className="testimonial-name">David Chen</h4>
                  <p className="testimonial-role">Restaurant Owner</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-image-wrapper">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" alt="Emily Rodriguez" className="testimonial-image" />
              </div>
              <div className="testimonial-content">
                <div className="testimonial-quote-icon">💬</div>
                <p className="testimonial-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="testimonial-author">
                  <h4 className="testimonial-name">Emily Rodriguez</h4>
                  <p className="testimonial-role">Food Blogger</p>
                </div>
              </div>
            </div>
          </div>
            <button className="scroll-arrow scroll-arrow-right" onClick={() => {
              const scrollContainer = document.querySelector('.testimonials-scroll');
              if (scrollContainer) {
                scrollContainer.scrollBy({ left: 450, behavior: 'smooth' });
              }
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App

