import React from "react";
import toast from "react-hot-toast";

const Home = () => {
  const handleButtonClick = (buttonName) => {
    toast.success(
      `🎯 ${buttonName} clicked! This is a dummy website to showcase Bot functionality.`
    );
  };

  const features = [
    {
      icon: "🚀",
      title: "Fast Performance",
      description:
        "Lightning-fast loading times and optimized performance for the best user experience.",
    },
    {
      icon: "🔒",
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with 99.9% uptime guarantee and data protection.",
    },
    {
      icon: "📱",
      title: "Mobile Ready",
      description:
        "Fully responsive design that works perfectly on all devices and screen sizes.",
    },
    {
      icon: "🎨",
      title: "Modern Design",
      description:
        "Beautiful, intuitive interface designed with the latest UX/UI principles.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      content:
        "This platform has revolutionized how we manage our business operations. The interface is intuitive and the results are outstanding.",
      avatar: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      content:
        "The analytics and insights provided have helped us increase our conversion rates by 40% in just three months.",
      avatar: "👨‍💻",
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      content:
        "As a small business, this platform gives us enterprise-level capabilities at an affordable price. Highly recommended!",
      avatar: "👩‍💼",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "99.9%", label: "Uptime" },
    { number: "50+", label: "Countries" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section id="hero" style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to Digital Innovation Hub</h1>
          <p style={styles.heroSubtitle}>
            Transform your business with cutting-edge technology solutions. We
            provide comprehensive digital services to help you grow and succeed
            in the modern world.
          </p>
          <div style={styles.heroButtons}>
            <button
              id="hero-cta-btn"
              style={styles.primaryButton}
              className="hero-cta-btn"
              onClick={() => handleButtonClick("Get Started Today")}
            >
              Get Started Today
            </button>
            <button
              id="hero-learn-more-btn"
              style={styles.secondaryButton}
              onClick={() => handleButtonClick("Learn More")}
            >
              Learn More
            </button>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.heroPlaceholder}>🎯</div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
          <p style={styles.sectionSubtitle}>
            We combine innovation, expertise, and dedication to deliver
            exceptional results for our clients.
          </p>
        </div>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={styles.testimonialsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>What Our Clients Say</h2>
          <p style={styles.sectionSubtitle}>
            Don't just take our word for it. Here's what our satisfied clients
            have to say about their experience.
          </p>
        </div>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={styles.testimonialCard}>
              <div style={styles.testimonialContent}>
                <div style={styles.quoteIcon}>"</div>
                <p style={styles.testimonialText}>{testimonial.content}</p>
              </div>
              <div style={styles.testimonialAuthor}>
                <div style={styles.authorAvatar}>{testimonial.avatar}</div>
                <div style={styles.authorInfo}>
                  <div style={styles.authorName}>{testimonial.name}</div>
                  <div style={styles.authorRole}>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of satisfied customers and transform your business
            today.
          </p>
          <div style={styles.ctaButtons}>
            <button
              id="cta-start-trial-btn"
              style={styles.ctaPrimaryButton}
              onClick={() => handleButtonClick("Start Free Trial")}
            >
              Start Free Trial
            </button>
            <button
              id="cta-schedule-demo-btn"
              style={styles.ctaSecondaryButton}
              onClick={() => handleButtonClick("Schedule Demo")}
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        id="featured-products"
        style={styles.featuredSection}
        className="featured-products"
      >
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <p style={styles.sectionSubtitle}>
            Discover our most popular solutions designed to meet your business
            needs.
          </p>
        </div>
        <div style={styles.productsGrid}>
          <div style={styles.productCard}>
            <div style={styles.productIcon}>💼</div>
            <h3 style={styles.productTitle}>Business Suite</h3>
            <p style={styles.productDescription}>
              Complete business management solution with CRM, analytics, and
              automation tools.
            </p>
            <div style={styles.productPrice}>Starting at $29/month</div>
          </div>
          <div style={styles.productCard}>
            <div style={styles.productIcon}>🛒</div>
            <h3 style={styles.productTitle}>E-commerce Platform</h3>
            <p style={styles.productDescription}>
              Build and manage your online store with our powerful e-commerce
              platform.
            </p>
            <div style={styles.productPrice}>Starting at $49/month</div>
          </div>
          <div style={styles.productCard}>
            <div style={styles.productIcon}>📊</div>
            <h3 style={styles.productTitle}>Analytics Pro</h3>
            <p style={styles.productDescription}>
              Advanced analytics and reporting tools to track and optimize your
              performance.
            </p>
            <div style={styles.productPrice}>Starting at $19/month</div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  // Hero Section
  heroSection: {
    display: "flex",
    alignItems: "center",
    minHeight: "70vh",
    padding: "4rem 2rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "0 0 50px 50px",
    marginBottom: "4rem",
  },
  heroContent: {
    flex: 1,
    paddingRight: "2rem",
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    lineHeight: "1.2",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "2.5rem",
    opacity: 0.9,
    lineHeight: "1.6",
  },
  heroButtons: {
    display: "flex",
    gap: "1rem",
  },
  primaryButton: {
    backgroundColor: "#ff6b6b",
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    padding: "1rem 2rem",
    borderRadius: "50px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  heroImage: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heroPlaceholder: {
    fontSize: "8rem",
    opacity: 0.8,
  },

  // Stats Section
  statsSection: {
    padding: "3rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "2rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  statCard: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  statNumber: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: "0.5rem",
  },
  statLabel: {
    fontSize: "1.1rem",
    color: "#666",
    fontWeight: "500",
  },

  // Section Headers
  sectionHeader: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  sectionSubtitle: {
    fontSize: "1.1rem",
    color: "#7f8c8d",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },

  // Features Section
  featuresSection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
  },
  featureCard: {
    backgroundColor: "white",
    padding: "2.5rem",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  featureIcon: {
    fontSize: "3rem",
    marginBottom: "1.5rem",
  },
  featureTitle: {
    fontSize: "1.4rem",
    color: "#2c3e50",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  featureDescription: {
    color: "#7f8c8d",
    lineHeight: "1.6",
  },

  // Testimonials Section
  testimonialsSection: {
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  testimonialsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "2rem",
  },
  testimonialCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  testimonialContent: {
    marginBottom: "1.5rem",
  },
  quoteIcon: {
    fontSize: "3rem",
    color: "#667eea",
    lineHeight: 1,
    marginBottom: "1rem",
  },
  testimonialText: {
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.6",
    fontStyle: "italic",
  },
  testimonialAuthor: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  authorAvatar: {
    fontSize: "2.5rem",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  authorRole: {
    fontSize: "0.9rem",
    color: "#7f8c8d",
  },

  // CTA Section
  ctaSection: {
    padding: "4rem 2rem",
    backgroundColor: "#2c3e50",
    color: "white",
    textAlign: "center",
    marginBottom: "4rem",
    borderRadius: "50px 0 50px 0",
  },
  ctaContent: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  ctaSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "2.5rem",
    opacity: 0.9,
  },
  ctaButtons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaPrimaryButton: {
    backgroundColor: "#ff6b6b",
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  ctaSecondaryButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    padding: "1rem 2rem",
    borderRadius: "50px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // Featured Products Section
  featuredSection: {
    padding: "4rem 2rem",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
  },
  productCard: {
    backgroundColor: "white",
    padding: "2.5rem",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
    border: "2px solid transparent",
  },
  productIcon: {
    fontSize: "3rem",
    marginBottom: "1.5rem",
  },
  productTitle: {
    fontSize: "1.4rem",
    color: "#2c3e50",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  productDescription: {
    color: "#7f8c8d",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
  },
  productPrice: {
    fontSize: "1.2rem",
    color: "#667eea",
    fontWeight: "bold",
  },
};

export default Home;
