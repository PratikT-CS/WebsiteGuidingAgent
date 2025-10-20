import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("agent-", "")]: value,
    }));
  };

  // Listen for agent-fill events to sync DOM changes with React state
  useEffect(() => {
    const handleAgentFill = (event) => {
      const { value, selector } = event.detail;

      // Extract field name from selector
      // Handle different selector formats: "#agent-name", "agent-name", etc.
      let fieldName = selector;
      if (selector.startsWith("#")) {
        fieldName = selector.substring(1); // Remove #
      }
      if (fieldName.startsWith("agent-")) {
        fieldName = fieldName.replace("agent-", ""); // Remove agent- prefix
      }

      // Update the form data state
      setFormData((prev) => {
        const newData = {
          ...prev,
          [fieldName]: value,
        };
        return newData;
      });
    };

    // Add event listener for agent-fill events
    document.addEventListener("agent-fill", handleAgentFill);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("agent-fill", handleAgentFill);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Simulate form submission
    toast.success(
      "🎯 Contact form submitted! This is a dummy website to showcase Bot functionality."
    );

    // Reset form
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  const offices = [
    {
      city: "San Francisco",
      address: "123 Tech Street, San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      email: "sf@digitalinnovation.com",
      hours: "Mon-Fri: 9AM-6PM PST",
    },
    {
      city: "New York",
      address: "456 Business Ave, New York, NY 10001",
      phone: "+1 (555) 234-5678",
      email: "ny@digitalinnovation.com",
      hours: "Mon-Fri: 9AM-6PM EST",
    },
    {
      city: "London",
      address: "789 Innovation Lane, London, UK EC1A 1AA",
      phone: "+44 20 7123 4567",
      email: "london@digitalinnovation.com",
      hours: "Mon-Fri: 9AM-6PM GMT",
    },
  ];

  const faqs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer:
        "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our main office.",
    },
    {
      question: "What services do you offer?",
      answer:
        "We provide web development, mobile app development, UI/UX design, digital consulting, e-commerce solutions, and cloud services.",
    },
    {
      question: "Do you work with international clients?",
      answer:
        "Yes! We have offices in San Francisco, New York, and London, and we work with clients worldwide.",
    },
    {
      question: "What is your typical project timeline?",
      answer:
        "Project timelines vary depending on scope and complexity. Simple websites take 2-4 weeks, while complex applications can take 3-6 months.",
    },
    {
      question: "Do you provide ongoing support?",
      answer:
        "Yes, we offer various support packages ranging from 1 month to 1 year of post-launch support and maintenance.",
    },
  ];

  const socialLinks = [
    {
      platform: "Twitter",
      url: "https://twitter.com/digitalinnovation",
      icon: "🐦",
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/company/digitalinnovation",
      icon: "💼",
    },
    {
      platform: "GitHub",
      url: "https://github.com/digitalinnovation",
      icon: "🐙",
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/digitalinnovation",
      icon: "📸",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section id="hero" style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Contact Us</h1>
          <p style={styles.heroSubtitle}>
            Ready to start your next project? We'd love to hear from you. Get in
            touch with our team and let's discuss how we can help bring your
            ideas to life.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section id="contact-form" style={styles.contactSection}>
        <div style={styles.contactContent}>
          <div style={styles.formContainer}>
            <h3 style={styles.formTitle}>Send us a Message</h3>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  id="agent-name"
                  type="text"
                  style={styles.input}
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  id="agent-email"
                  type="email"
                  style={styles.input}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  id="agent-message"
                  style={styles.textarea}
                  placeholder="Tell us about your project or inquiry..."
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <button
                id="agent-submit"
                type="submit"
                style={styles.submitButton}
              >
                Send Message
              </button>
            </form>
          </div>
          <div style={styles.contactInfo}>
            <h2 style={styles.sectionTitle}>Get in Touch</h2>
            <p style={styles.description}>
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
            <div style={styles.contactDetails}>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📧</div>
                <div style={styles.contactContent}>
                  <h4 style={styles.contactLabel}>Email</h4>
                  <p style={styles.contactValue}>hello@digitalinnovation.com</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📞</div>
                <div style={styles.contactContent}>
                  <h4 style={styles.contactLabel}>Phone</h4>
                  <p style={styles.contactValue}>+1 (555) 123-4567</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📍</div>
                <div style={styles.contactContent}>
                  <h4 style={styles.contactLabel}>Headquarters</h4>
                  <p style={styles.contactValue}>
                    123 Business St, San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section id="offices" style={styles.officesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Offices</h2>
          <p style={styles.sectionSubtitle}>
            Visit us at any of our global locations or reach out to the office
            closest to you.
          </p>
        </div>
        <div style={styles.officesGrid}>
          {offices.map((office, index) => (
            <div key={index} style={styles.officeCard}>
              <h3 style={styles.officeCity}>{office.city}</h3>
              <div style={styles.officeDetails}>
                <div style={styles.officeDetail}>
                  <span style={styles.officeLabel}>📍</span>
                  <span style={styles.officeValue}>{office.address}</span>
                </div>
                <div style={styles.officeDetail}>
                  <span style={styles.officeLabel}>📞</span>
                  <span style={styles.officeValue}>{office.phone}</span>
                </div>
                <div style={styles.officeDetail}>
                  <span style={styles.officeLabel}>📧</span>
                  <span style={styles.officeValue}>{office.email}</span>
                </div>
                <div style={styles.officeDetail}>
                  <span style={styles.officeLabel}>🕒</span>
                  <span style={styles.officeValue}>{office.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Business Hours */}
      <section id="business-hours" style={styles.hoursSection}>
        <div style={styles.hoursContent}>
          <div style={styles.hoursInfo}>
            <h2 style={styles.sectionTitle}>Business Hours</h2>
            <p style={styles.sectionSubtitle}>
              Our team is available during these hours to assist you with your
              inquiries and projects.
            </p>
            <div style={styles.hoursList}>
              <div style={styles.hoursItem}>
                <span style={styles.day}>Monday - Friday</span>
                <span style={styles.time}>9:00 AM - 6:00 PM</span>
              </div>
              <div style={styles.hoursItem}>
                <span style={styles.day}>Saturday</span>
                <span style={styles.time}>10:00 AM - 4:00 PM</span>
              </div>
              <div style={styles.hoursItem}>
                <span style={styles.day}>Sunday</span>
                <span style={styles.time}>Closed</span>
              </div>
            </div>
            <div style={styles.emergencyContact}>
              <p style={styles.emergencyText}>
                <strong>Emergency Support:</strong> Available 24/7 for critical
                issues
              </p>
              <p style={styles.emergencyPhone}>+1 (555) 911-TECH</p>
            </div>
          </div>
          <div style={styles.hoursVisual}>
            <div style={styles.clockIcon}>🕐</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={styles.faqSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p style={styles.sectionSubtitle}>
            Find answers to common questions about our services, processes, and
            policies.
          </p>
        </div>
        <div style={styles.faqGrid}>
          {faqs.map((faq, index) => (
            <div key={index} style={styles.faqCard}>
              <h3 style={styles.faqQuestion}>{faq.question}</h3>
              <p style={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Media */}
      <section id="social-media" style={styles.socialSection}>
        <div style={styles.socialContent}>
          <div style={styles.socialInfo}>
            <h2 style={styles.sectionTitle}>Follow Us</h2>
            <p style={styles.sectionSubtitle}>
              Stay connected with us on social media for the latest updates,
              insights, and behind-the-scenes content.
            </p>
          </div>
          <div style={styles.socialLinks}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                <span style={styles.socialIcon}>{social.icon}</span>
                <span style={styles.socialPlatform}>{social.platform}</span>
              </a>
            ))}
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

  // Contact Section
  contactSection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  contactContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4rem",
    alignItems: "start",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "15px",
    border: "1px solid #e9ecef",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  formTitle: {
    color: "#2c3e50",
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "#2c3e50",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  input: {
    padding: "1rem",
    border: "2px solid #e9ecef",
    borderRadius: "10px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
    outline: "none",
  },
  textarea: {
    padding: "1rem",
    border: "2px solid #e9ecef",
    borderRadius: "10px",
    fontSize: "1rem",
    resize: "vertical",
    minHeight: "120px",
    transition: "border-color 0.3s ease",
    outline: "none",
  },
  submitButton: {
    backgroundColor: "#667eea",
    color: "white",
    padding: "1rem 2rem",
    border: "none",
    borderRadius: "25px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "all 0.3s ease",
  },
  contactInfo: {
    backgroundColor: "#f8f9fa",
    padding: "2rem",
    borderRadius: "15px",
  },
  description: {
    color: "#7f8c8d",
    lineHeight: "1.6",
    marginBottom: "2rem",
  },
  contactDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #e9ecef",
    transition: "transform 0.3s ease",
  },
  contactIcon: {
    fontSize: "1.5rem",
    marginRight: "1rem",
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    color: "#667eea",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  contactValue: {
    color: "#2c3e50",
    margin: 0,
    fontSize: "0.95rem",
  },

  // Offices Section
  officesSection: {
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  officesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
  },
  officeCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  officeCity: {
    color: "#2c3e50",
    fontSize: "1.4rem",
    marginBottom: "1.5rem",
    fontWeight: "bold",
  },
  officeDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  officeDetail: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
  },
  officeLabel: {
    fontSize: "1rem",
    marginTop: "0.1rem",
  },
  officeValue: {
    color: "#7f8c8d",
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },

  // Hours Section
  hoursSection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  hoursContent: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "4rem",
    alignItems: "center",
  },
  hoursInfo: {
    maxWidth: "600px",
  },
  hoursList: {
    marginBottom: "2rem",
  },
  hoursItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    marginBottom: "1rem",
  },
  day: {
    color: "#2c3e50",
    fontWeight: "600",
  },
  time: {
    color: "#667eea",
    fontWeight: "bold",
  },
  emergencyContact: {
    backgroundColor: "#fff3cd",
    padding: "1.5rem",
    borderRadius: "10px",
    border: "1px solid #ffeaa7",
  },
  emergencyText: {
    color: "#856404",
    marginBottom: "0.5rem",
  },
  emergencyPhone: {
    color: "#667eea",
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: 0,
  },
  hoursVisual: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  clockIcon: {
    fontSize: "8rem",
    opacity: 0.7,
  },

  // FAQ Section
  faqSection: {
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  faqGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "2rem",
  },
  faqCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  faqQuestion: {
    color: "#2c3e50",
    fontSize: "1.2rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  faqAnswer: {
    color: "#7f8c8d",
    lineHeight: "1.6",
  },

  // Social Section
  socialSection: {
    padding: "4rem 2rem",
    backgroundColor: "#2c3e50",
    color: "white",
    marginBottom: "4rem",
    borderRadius: "50px 0 50px 0",
  },
  socialContent: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  socialInfo: {
    marginBottom: "3rem",
  },
  socialLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap",
  },
  socialLink: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    textDecoration: "none",
    color: "white",
    transition: "all 0.3s ease",
    minWidth: "120px",
  },
  socialIcon: {
    fontSize: "2rem",
  },
  socialPlatform: {
    fontSize: "1rem",
    fontWeight: "500",
  },
};

export default Contact;
