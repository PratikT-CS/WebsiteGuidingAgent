import React from "react";
import toast from "react-hot-toast";

const About = () => {
  const handleButtonClick = (buttonName) => {
    toast.success(
      `🎯 ${buttonName} clicked! This is a dummy website to showcase Bot functionality.`
    );
  };

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Visionary leader with 15+ years in tech innovation and business strategy.",
      avatar: "👩‍💼",
      expertise: ["Leadership", "Strategy", "Innovation"],
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Technical architect passionate about scalable solutions and cutting-edge technology.",
      avatar: "👨‍💻",
      expertise: ["Architecture", "AI/ML", "Cloud"],
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      bio: "Creative director focused on user experience and beautiful, functional designs.",
      avatar: "👩‍🎨",
      expertise: ["UX/UI", "Branding", "Product Design"],
    },
    {
      name: "David Thompson",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in modern web technologies and frameworks.",
      avatar: "👨‍🔧",
      expertise: ["React", "Node.js", "DevOps"],
    },
  ];

  const values = [
    {
      icon: "🚀",
      title: "Innovation",
      description:
        "We constantly push boundaries and explore new technologies to stay ahead of the curve.",
    },
    {
      icon: "🎯",
      title: "Excellence",
      description:
        "We maintain the highest standards in everything we do, from code quality to customer service.",
    },
    {
      icon: "🤝",
      title: "Collaboration",
      description:
        "We believe in building strong relationships with our clients, partners, and team members.",
    },
    {
      icon: "🌱",
      title: "Growth",
      description:
        "We foster continuous learning and personal development for everyone on our team.",
    },
  ];

  const achievements = [
    { number: "500+", label: "Projects Completed" },
    { number: "150+", label: "Happy Clients" },
    { number: "5", label: "Years Experience" },
    { number: "99%", label: "Client Satisfaction" },
  ];

  const timeline = [
    {
      year: "2019",
      title: "Company Founded",
      description:
        "Started with a vision to revolutionize digital experiences.",
    },
    {
      year: "2020",
      title: "First Major Client",
      description: "Secured partnership with Fortune 500 company.",
    },
    {
      year: "2021",
      title: "Team Expansion",
      description:
        "Grew from 5 to 25 team members across multiple departments.",
    },
    {
      year: "2022",
      title: "Award Recognition",
      description:
        'Received "Best Digital Agency" award from Tech Innovation Council.',
    },
    {
      year: "2023",
      title: "Global Expansion",
      description:
        "Opened offices in 3 countries and served clients worldwide.",
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched AI-powered solutions and automation services.",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section id="hero" style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>About Digital Innovation Hub</h1>
          <p style={styles.heroSubtitle}>
            We are a passionate team dedicated to creating innovative solutions
            and delivering exceptional experiences. Our mission is to provide
            high-quality services that make a positive impact in the digital
            world.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section id="story" style={styles.storySection}>
        <div style={styles.storyContent}>
          <div style={styles.storyText}>
            <h2 style={styles.sectionTitle}>Our Story</h2>
            <p style={styles.storyParagraph}>
              Founded in 2019, Digital Innovation Hub began as a small team of
              passionate developers and designers who believed that technology
              should serve humanity. What started as a vision to create better
              digital experiences has grown into a full-service digital agency
              serving clients worldwide.
            </p>
            <p style={styles.storyParagraph}>
              Today, we combine cutting-edge technology with human-centered
              design to create solutions that not only meet our clients' needs
              but exceed their expectations. Our journey has been marked by
              continuous learning, innovation, and a commitment to excellence
              that drives everything we do.
            </p>
            <div style={styles.missionStatement} className="mission">
              <h3 style={styles.missionTitle}>Our Mission</h3>
              <p style={styles.missionText}>
                To empower businesses and individuals through innovative digital
                solutions that drive growth, enhance user experiences, and
                create meaningful connections in an increasingly digital world.
              </p>
            </div>
          </div>
          <div style={styles.storyImage}>
            <div style={styles.imagePlaceholder}>🏢</div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" style={styles.valuesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Values</h2>
          <p style={styles.sectionSubtitle}>
            These core values guide everything we do and shape our company
            culture.
          </p>
        </div>
        <div style={styles.valuesGrid}>
          {values.map((value, index) => (
            <div key={index} style={styles.valueCard}>
              <div style={styles.valueIcon}>{value.icon}</div>
              <h3 style={styles.valueTitle}>{value.title}</h3>
              <p style={styles.valueDescription}>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section id="team" style={styles.teamSection} className="team">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Meet Our Team</h2>
          <p style={styles.sectionSubtitle}>
            The talented individuals who make our vision a reality.
          </p>
        </div>
        <div id="team" style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} style={styles.teamCard}>
              <div style={styles.memberAvatar}>{member.avatar}</div>
              <h3 style={styles.memberName}>{member.name}</h3>
              <p style={styles.memberRole}>{member.role}</p>
              <p style={styles.memberBio}>{member.bio}</p>
              <div style={styles.expertiseTags}>
                {member.expertise.map((skill, skillIndex) => (
                  <span key={skillIndex} style={styles.expertiseTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" style={styles.achievementsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Achievements</h2>
          <p style={styles.sectionSubtitle}>
            Numbers that reflect our commitment to excellence and client
            satisfaction.
          </p>
        </div>
        <div style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <div key={index} style={styles.achievementCard}>
              <div style={styles.achievementNumber}>{achievement.number}</div>
              <div style={styles.achievementLabel}>{achievement.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" style={styles.timelineSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Journey</h2>
          <p style={styles.sectionSubtitle}>
            Key milestones in our company's growth and development.
          </p>
        </div>
        <div style={styles.timelineContainer}>
          {timeline.map((event, index) => (
            <div key={index} style={styles.timelineItem}>
              <div style={styles.timelineYear}>{event.year}</div>
              <div style={styles.timelineContent}>
                <h3 style={styles.timelineTitle}>{event.title}</h3>
                <p style={styles.timelineDescription}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company Culture */}
      <section id="culture" style={styles.cultureSection}>
        <div style={styles.cultureContent}>
          <div style={styles.cultureText}>
            <h2 style={styles.sectionTitle}>Our Culture</h2>
            <p style={styles.cultureParagraph}>
              At Digital Innovation Hub, we believe that great work comes from
              great people working in a supportive and inclusive environment.
              Our culture is built on trust, transparency, and mutual respect.
            </p>
            <div style={styles.cultureFeatures}>
              <div style={styles.cultureFeature}>
                <h4 style={styles.cultureFeatureTitle}>
                  Flexible Work Environment
                </h4>
                <p style={styles.cultureFeatureText}>
                  Remote-first approach with flexible hours and work-life
                  balance.
                </p>
              </div>
              <div style={styles.cultureFeature}>
                <h4 style={styles.cultureFeatureTitle}>Continuous Learning</h4>
                <p style={styles.cultureFeatureText}>
                  Regular training, conferences, and skill development
                  opportunities.
                </p>
              </div>
              <div style={styles.cultureFeature}>
                <h4 style={styles.cultureFeatureTitle}>Open Communication</h4>
                <p style={styles.cultureFeatureText}>
                  Flat hierarchy with open-door policy and regular team
                  feedback.
                </p>
              </div>
            </div>
          </div>
          <div style={styles.cultureImage}>
            <div style={styles.culturePlaceholder}>🌟</div>
          </div>
        </div>
        <div style={styles.learnMoreSection}>
          <button
            id="learn-more-btn"
            style={styles.learnMoreButton}
            className="learn-more-btn"
            onClick={() => handleButtonClick("Learn More About Our Culture")}
          >
            Learn More About Our Culture
          </button>
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

  // Story Section
  storySection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  storyContent: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "4rem",
    alignItems: "center",
  },
  storyText: {
    maxWidth: "600px",
  },
  storyParagraph: {
    fontSize: "1.1rem",
    lineHeight: "1.7",
    color: "#34495e",
    marginBottom: "1.5rem",
  },
  missionStatement: {
    backgroundColor: "#f8f9fa",
    padding: "2rem",
    borderRadius: "10px",
    marginTop: "2rem",
    border: "2px solid #e9ecef",
  },
  missionTitle: {
    color: "#2c3e50",
    fontSize: "1.5rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  missionText: {
    color: "#555",
    lineHeight: "1.6",
    fontSize: "1rem",
  },
  storyImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    fontSize: "8rem",
    opacity: 0.7,
  },

  // Values Section
  valuesSection: {
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  valuesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  },
  valueCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  valueIcon: {
    fontSize: "3rem",
    marginBottom: "1.5rem",
  },
  valueTitle: {
    color: "#2c3e50",
    fontSize: "1.4rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  valueDescription: {
    color: "#7f8c8d",
    lineHeight: "1.6",
  },

  // Team Section
  teamSection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
  },
  teamCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  memberAvatar: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  memberName: {
    color: "#2c3e50",
    fontSize: "1.3rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  memberRole: {
    color: "#667eea",
    fontSize: "1rem",
    marginBottom: "1rem",
    fontWeight: "600",
  },
  memberBio: {
    color: "#7f8c8d",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
  },
  expertiseTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    justifyContent: "center",
  },
  expertiseTag: {
    backgroundColor: "#e9ecef",
    color: "#495057",
    padding: "0.25rem 0.75rem",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },

  // Achievements Section
  achievementsSection: {
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "2rem",
  },
  achievementCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  achievementNumber: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: "0.5rem",
  },
  achievementLabel: {
    fontSize: "1.1rem",
    color: "#666",
    fontWeight: "500",
  },

  // Timeline Section
  timelineSection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  timelineContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  timelineItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "3rem",
    position: "relative",
  },
  timelineYear: {
    backgroundColor: "#667eea",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "25px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    minWidth: "100px",
    textAlign: "center",
    marginRight: "2rem",
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  timelineTitle: {
    color: "#2c3e50",
    fontSize: "1.3rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  timelineDescription: {
    color: "#7f8c8d",
    lineHeight: "1.6",
  },

  // Culture Section
  cultureSection: {
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  cultureContent: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "4rem",
    alignItems: "center",
    marginBottom: "3rem",
  },
  cultureText: {
    maxWidth: "600px",
  },
  cultureParagraph: {
    fontSize: "1.1rem",
    lineHeight: "1.7",
    color: "#34495e",
    marginBottom: "2rem",
  },
  cultureFeatures: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  cultureFeature: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cultureFeatureTitle: {
    color: "#2c3e50",
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  cultureFeatureText: {
    color: "#7f8c8d",
    lineHeight: "1.6",
  },
  cultureImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  culturePlaceholder: {
    fontSize: "8rem",
    opacity: 0.7,
  },
  learnMoreSection: {
    textAlign: "center",
  },
  learnMoreButton: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default About;
