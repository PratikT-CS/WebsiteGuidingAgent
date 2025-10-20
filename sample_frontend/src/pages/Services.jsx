import React from "react";
import toast from "react-hot-toast";

const Services = () => {
  const handleButtonClick = (buttonName) => {
    toast.success(
      `🎯 ${buttonName} clicked! This is a dummy website to showcase Bot functionality.`
    );
  };

  const services = [
    {
      title: "Web Development",
      description:
        "Custom web applications built with modern technologies and best practices.",
      icon: "🌐",
      features: [
        "React & Vue.js",
        "Node.js Backend",
        "Responsive Design",
        "Performance Optimization",
      ],
      pricing: "Starting at $2,500",
    },
    {
      title: "Mobile App Development",
      description:
        "Native and cross-platform mobile applications for iOS and Android.",
      icon: "📱",
      features: [
        "iOS & Android",
        "React Native",
        "Flutter",
        "App Store Optimization",
      ],
      pricing: "Starting at $5,000",
    },
    {
      title: "UI/UX Design",
      description:
        "Beautiful and intuitive user interfaces that enhance user experience.",
      icon: "🎨",
      features: [
        "User Research",
        "Wireframing",
        "Prototyping",
        "Design Systems",
      ],
      pricing: "Starting at $1,500",
    },
    {
      title: "Digital Consulting",
      description:
        "Expert advice and guidance for your digital transformation journey.",
      icon: "💡",
      features: [
        "Strategy Planning",
        "Technology Audit",
        "Process Optimization",
        "Training",
      ],
      pricing: "Starting at $150/hour",
    },
    {
      title: "E-commerce Solutions",
      description:
        "Complete online store setup with payment processing and inventory management.",
      icon: "🛒",
      features: [
        "Shopify & WooCommerce",
        "Payment Integration",
        "Inventory Management",
        "Analytics",
      ],
      pricing: "Starting at $3,000",
    },
    {
      title: "Cloud & DevOps",
      description:
        "Scalable cloud infrastructure and deployment automation solutions.",
      icon: "☁️",
      features: ["AWS & Azure", "CI/CD Pipelines", "Monitoring", "Security"],
      pricing: "Starting at $2,000",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$2,500",
      period: "per project",
      description: "Perfect for small businesses and startups",
      features: [
        "Basic website or app",
        "Up to 5 pages/screens",
        "Responsive design",
        "Basic SEO optimization",
        "1 month support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$7,500",
      period: "per project",
      description: "Ideal for growing businesses",
      features: [
        "Advanced web application",
        "Up to 15 pages/screens",
        "Custom functionality",
        "Advanced SEO & Analytics",
        "3 months support",
        "Performance optimization",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "quote",
      description: "Tailored solutions for large organizations",
      features: [
        "Complex enterprise solution",
        "Unlimited pages/screens",
        "Advanced integrations",
        "Dedicated project manager",
        "6 months support",
        "Training & documentation",
      ],
      popular: false,
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Discovery & Planning",
      description:
        "We start by understanding your business goals, target audience, and requirements through detailed consultation.",
      icon: "🔍",
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description:
        "Create wireframes, mockups, and interactive prototypes to visualize your solution before development.",
      icon: "🎨",
    },
    {
      step: "03",
      title: "Development",
      description:
        "Build your solution using modern technologies with regular updates and quality assurance.",
      icon: "⚙️",
    },
    {
      step: "04",
      title: "Testing & Launch",
      description:
        "Thorough testing across devices and platforms, followed by deployment and launch support.",
      icon: "🚀",
    },
  ];

  const successStories = [
    {
      client: "TechStart Inc.",
      service: "Web Development",
      result: "300% increase in user engagement",
      description:
        "Built a modern web platform that transformed their customer onboarding process.",
    },
    {
      client: "RetailPlus",
      service: "E-commerce Solution",
      result: "150% boost in online sales",
      description:
        "Launched a comprehensive e-commerce platform with integrated payment systems.",
    },
    {
      client: "HealthCare Pro",
      service: "Mobile App Development",
      result: "50,000+ app downloads",
      description:
        "Developed a patient management mobile app that streamlined healthcare workflows.",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section id="hero" style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Our Services</h1>
          <p style={styles.heroSubtitle}>
            We offer a comprehensive range of digital services to help your
            business grow and succeed. From web development to mobile apps, we
            provide end-to-end solutions tailored to your needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" style={styles.servicesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>What We Do</h2>
          <p style={styles.sectionSubtitle}>
            Our expertise spans across multiple domains to deliver complete
            digital solutions.
          </p>
        </div>
        <div style={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={index} style={styles.serviceCard}>
              <div style={styles.serviceHeader}>
                <div style={styles.serviceIcon}>{service.icon}</div>
                <div style={styles.serviceInfo}>
                  <h3 style={styles.serviceTitle}>{service.title}</h3>
                  <p style={styles.servicePricing}>{service.pricing}</p>
                </div>
              </div>
              <p style={styles.serviceDescription}>{service.description}</p>
              <div style={styles.serviceFeatures}>
                {service.features.map((feature, featureIndex) => (
                  <span key={featureIndex} style={styles.featureTag}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" style={styles.pricingSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Pricing Plans</h2>
          <p style={styles.sectionSubtitle}>
            Transparent pricing with no hidden fees. Choose the plan that fits
            your needs.
          </p>
        </div>
        <div style={styles.pricingGrid}>
          {pricingPlans.map((plan, index) => (
            <div key={index} style={styles.pricingCard}>
              {plan.popular && (
                <div style={styles.popularBadge}>Most Popular</div>
              )}
              <div style={styles.planHeader}>
                <h3 style={styles.planName}>{plan.name}</h3>
                <div style={styles.planPrice}>
                  <span style={styles.priceAmount}>{plan.price}</span>
                  <span style={styles.pricePeriod}>{plan.period}</span>
                </div>
                <p style={styles.planDescription}>{plan.description}</p>
              </div>
              <div style={styles.planFeatures}>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} style={styles.featureItem}>
                    <span style={styles.featureIcon}>✓</span>
                    <span style={styles.featureText}>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                id="contact-btn"
                style={styles.planButton}
                className="contact-btn"
                onClick={() => handleButtonClick("Get Started")}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section id="process" style={styles.processSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Process</h2>
          <p style={styles.sectionSubtitle}>
            A proven methodology that ensures successful project delivery and
            client satisfaction.
          </p>
        </div>
        <div style={styles.processGrid}>
          {processSteps.map((step, index) => (
            <div key={index} style={styles.processCard}>
              <div style={styles.processStep}>{step.step}</div>
              <div style={styles.processIcon}>{step.icon}</div>
              <h3 style={styles.processTitle}>{step.title}</h3>
              <p style={styles.processDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" style={styles.successSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Success Stories</h2>
          <p style={styles.sectionSubtitle}>
            Real results from real clients. See how we've helped businesses
            achieve their goals.
          </p>
        </div>
        <div style={styles.successGrid}>
          {successStories.map((story, index) => (
            <div key={index} style={styles.successCard}>
              <div style={styles.successHeader}>
                <h3 style={styles.clientName}>{story.client}</h3>
                <span style={styles.serviceType}>{story.service}</span>
              </div>
              <div style={styles.successResult}>{story.result}</div>
              <p style={styles.successDescription}>{story.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Start Your Project?</h2>
          <p style={styles.ctaSubtitle}>
            Let's discuss your requirements and create a solution that drives
            your business forward.
          </p>
          <div style={styles.ctaButtons}>
            <button
              id="services-get-quote-btn"
              style={styles.ctaPrimaryButton}
              onClick={() => handleButtonClick("Get Free Quote")}
            >
              Get Free Quote
            </button>
            <button
              id="services-schedule-consultation-btn"
              style={styles.ctaSecondaryButton}
              onClick={() => handleButtonClick("Schedule Consultation")}
            >
              Schedule Consultation
            </button>
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
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
    marginBottom: "4rem",
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "3rem",
    color: "#2c3e50",
    marginBottom: "1.5rem",
    fontWeight: "bold",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    color: "#7f8c8d",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto",
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

  // Services Section
  servicesSection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "2rem",
  },
  serviceCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    border: "1px solid #e9ecef",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  serviceHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  serviceIcon: {
    fontSize: "3rem",
    marginRight: "1rem",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    color: "#2c3e50",
    fontSize: "1.3rem",
    marginBottom: "0.25rem",
    fontWeight: "bold",
  },
  servicePricing: {
    color: "#667eea",
    fontSize: "1rem",
    fontWeight: "600",
  },
  serviceDescription: {
    color: "#7f8c8d",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
  },
  serviceFeatures: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  featureTag: {
    backgroundColor: "#e9ecef",
    color: "#495057",
    padding: "0.25rem 0.75rem",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },

  // Pricing Section
  pricingSection: {
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
  },
  pricingCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    position: "relative",
    transition: "transform 0.3s ease",
  },
  popularBadge: {
    position: "absolute",
    top: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#ff6b6b",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  planHeader: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  planName: {
    color: "#2c3e50",
    fontSize: "1.5rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  planPrice: {
    marginBottom: "1rem",
  },
  priceAmount: {
    color: "#667eea",
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  pricePeriod: {
    color: "#7f8c8d",
    fontSize: "1rem",
    marginLeft: "0.5rem",
  },
  planDescription: {
    color: "#7f8c8d",
    fontSize: "1rem",
  },
  planFeatures: {
    marginBottom: "2rem",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  featureIcon: {
    color: "#28a745",
    marginRight: "0.75rem",
    fontWeight: "bold",
  },
  featureText: {
    color: "#495057",
  },
  planButton: {
    width: "100%",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "1rem",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // Process Section
  processSection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  processGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  },
  processCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  processStep: {
    backgroundColor: "#667eea",
    color: "white",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: "0 auto 1rem auto",
  },
  processIcon: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  processTitle: {
    color: "#2c3e50",
    fontSize: "1.3rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  processDescription: {
    color: "#7f8c8d",
    lineHeight: "1.6",
  },

  // Success Section
  successSection: {
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  successGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
  },
  successCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  successHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  clientName: {
    color: "#2c3e50",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  serviceType: {
    backgroundColor: "#e9ecef",
    color: "#495057",
    padding: "0.25rem 0.75rem",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  successResult: {
    color: "#28a745",
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  successDescription: {
    color: "#7f8c8d",
    lineHeight: "1.6",
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
};

export default Services;
