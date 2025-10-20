import React, { useState } from "react";
import toast from "react-hot-toast";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleButtonClick = (buttonName) => {
    toast.success(
      `🎯 ${buttonName} clicked! This is a dummy website to showcase Bot functionality.`
    );
  };

  const categories = [
    "All",
    "Development",
    "Design",
    "Tutorial",
    "Business",
    "Technology",
  ];

  const blogPosts = [
    {
      title: "Getting Started with React Hooks",
      excerpt:
        "Learn the fundamentals of React Hooks and how to build your first functional component with state management.",
      date: "September 20, 2024",
      readTime: "8 min read",
      category: "Tutorial",
      author: "Sarah Johnson",
      featured: true,
      image: "⚛️",
    },
    {
      title: "Modern CSS Grid Layout Techniques",
      excerpt:
        "Explore the latest CSS Grid features and best practices for creating responsive layouts in modern web development.",
      date: "September 18, 2024",
      readTime: "12 min read",
      category: "Design",
      author: "Emily Rodriguez",
      featured: true,
      image: "🎨",
    },
    {
      title: "JavaScript ES2024 New Features",
      excerpt:
        "Discover the new features and improvements in the latest JavaScript specification and how to use them effectively.",
      date: "September 15, 2024",
      readTime: "10 min read",
      category: "Development",
      author: "Michael Chen",
      featured: false,
      image: "📜",
    },
    {
      title: "Building Responsive Web Applications",
      excerpt:
        "Comprehensive guide to creating web applications that work perfectly across all devices and screen sizes.",
      date: "September 12, 2024",
      readTime: "15 min read",
      category: "Design",
      author: "David Thompson",
      featured: false,
      image: "📱",
    },
    {
      title: "AI Integration in Web Development",
      excerpt:
        "How artificial intelligence is transforming web development and the tools you should be using in 2024.",
      date: "September 10, 2024",
      readTime: "14 min read",
      category: "Technology",
      author: "Sarah Johnson",
      featured: true,
      image: "🤖",
    },
    {
      title: "Startup Growth Strategies",
      excerpt:
        "Proven strategies for scaling your startup from idea to market leader, with real-world case studies.",
      date: "September 8, 2024",
      readTime: "18 min read",
      category: "Business",
      author: "Sarah Johnson",
      featured: false,
      image: "🚀",
    },
    {
      title: "Node.js Performance Optimization",
      excerpt:
        "Advanced techniques for optimizing Node.js applications for better performance and scalability.",
      date: "September 5, 2024",
      readTime: "11 min read",
      category: "Development",
      author: "Michael Chen",
      featured: false,
      image: "⚡",
    },
    {
      title: "UI/UX Design Trends 2024",
      excerpt:
        "The latest design trends shaping user interfaces and experiences in 2024, with practical examples.",
      date: "September 3, 2024",
      readTime: "9 min read",
      category: "Design",
      author: "Emily Rodriguez",
      featured: false,
      image: "✨",
    },
  ];

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const newsletterSubscribers = "15,000+";
  const totalArticles = blogPosts.length;

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section id="hero" style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Our Blog</h1>
          <p style={styles.heroSubtitle}>
            Stay updated with the latest trends, tutorials, and insights from
            our team of experts. Discover new technologies, best practices, and
            industry insights.
          </p>
          <div style={styles.blogStats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{totalArticles}+</span>
              <span style={styles.statLabel}>Articles</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{newsletterSubscribers}</span>
              <span style={styles.statLabel}>Subscribers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section id="featured-posts" style={styles.featuredSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Articles</h2>
          <p style={styles.sectionSubtitle}>
            Our most popular and impactful content, handpicked by our editorial
            team.
          </p>
        </div>
        <div style={styles.featuredGrid}>
          {featuredPosts.map((post, index) => (
            <article key={index} style={styles.featuredPost}>
              <div style={styles.featuredImage}>{post.image}</div>
              <div style={styles.featuredContent}>
                <div style={styles.featuredHeader}>
                  <span style={styles.featuredCategory}>{post.category}</span>
                  <div style={styles.featuredMeta}>
                    <span style={styles.featuredDate}>{post.date}</span>
                    <span style={styles.featuredReadTime}>{post.readTime}</span>
                  </div>
                </div>
                <h3 style={styles.featuredTitle}>{post.title}</h3>
                <p style={styles.featuredExcerpt}>{post.excerpt}</p>
                <div style={styles.featuredFooter}>
                  <span style={styles.featuredAuthor}>By {post.author}</span>
                  <button
                    id="featured-read-more-btn"
                    style={styles.featuredReadButton}
                    className="read-more-btn"
                    onClick={() => handleButtonClick("Read More")}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Search and Filter */}
      <section id="search-filter" style={styles.filterSection}>
        <div style={styles.filterContainer}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              id="blog-search"
            />
          </div>
          <div style={styles.categoryFilters}>
            {categories.map((category, index) => (
              <button
                key={index}
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === category
                    ? styles.categoryButtonActive
                    : {}),
                }}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section id="blog-posts" style={styles.blogSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>All Articles</h2>
          <p style={styles.sectionSubtitle}>
            Browse our complete collection of articles, tutorials, and insights.
          </p>
        </div>
        <div style={styles.blogGrid}>
          {filteredPosts.map((post, index) => (
            <article
              key={index}
              style={styles.blogPost}
              className="blog-article"
            >
              <div style={styles.postImage}>{post.image}</div>
              <div style={styles.postContent}>
                <div style={styles.postHeader}>
                  <span style={styles.category}>{post.category}</span>
                  <div style={styles.postMeta}>
                    <span style={styles.date}>{post.date}</span>
                    <span style={styles.readTime}>{post.readTime}</span>
                  </div>
                </div>
                <h2 style={styles.postTitle}>{post.title}</h2>
                <p style={styles.postExcerpt}>{post.excerpt}</p>
                <div style={styles.postFooter}>
                  <span style={styles.postAuthor}>By {post.author}</span>
                  <button
                    id="blog-read-more-btn"
                    style={styles.readMoreButton}
                    className="read-more-btn"
                    onClick={() => handleButtonClick("Read More")}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" style={styles.newsletterSection}>
        <div style={styles.newsletterContent}>
          <div style={styles.newsletterText}>
            <h2 style={styles.newsletterTitle}>Stay Updated</h2>
            <p style={styles.newsletterSubtitle}>
              Subscribe to our newsletter and never miss the latest articles,
              tutorials, and industry insights.
            </p>
            <div style={styles.newsletterStats}>
              <div style={styles.newsletterStat}>
                <span style={styles.newsletterStatNumber}>
                  {newsletterSubscribers}
                </span>
                <span style={styles.newsletterStatLabel}>Subscribers</span>
              </div>
              <div style={styles.newsletterStat}>
                <span style={styles.newsletterStatNumber}>Weekly</span>
                <span style={styles.newsletterStatLabel}>Updates</span>
              </div>
            </div>
          </div>
          <div style={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email address"
              style={styles.newsletterInput}
            />
            <button
              id="newsletter-subscribe-btn"
              style={styles.newsletterButton}
              onClick={() => handleButtonClick("Subscribe")}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section id="categories" style={styles.categoriesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Popular Categories</h2>
          <p style={styles.sectionSubtitle}>
            Explore articles by topic and find content that interests you most.
          </p>
        </div>
        <div style={styles.categoriesGrid}>
          {categories.slice(1).map((category, index) => {
            const categoryPosts = blogPosts.filter(
              (post) => post.category === category
            );
            return (
              <div key={index} style={styles.categoryCard}>
                <div style={styles.categoryIcon}>
                  {category === "Development" && "💻"}
                  {category === "Design" && "🎨"}
                  {category === "Tutorial" && "📚"}
                  {category === "Business" && "💼"}
                  {category === "Technology" && "🔬"}
                </div>
                <h3 style={styles.categoryCardTitle}>{category}</h3>
                <p style={styles.categoryCardCount}>
                  {categoryPosts.length} Articles
                </p>
                <p style={styles.categoryCardDescription}>
                  {category === "Development" &&
                    "Code, frameworks, and programming best practices"}
                  {category === "Design" &&
                    "UI/UX, visual design, and user experience insights"}
                  {category === "Tutorial" &&
                    "Step-by-step guides and learning resources"}
                  {category === "Business" &&
                    "Startup strategies, growth tactics, and entrepreneurship"}
                  {category === "Technology" &&
                    "Emerging technologies and industry trends"}
                </p>
              </div>
            );
          })}
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
    margin: "0 auto 2rem auto",
  },
  blogStats: {
    display: "flex",
    justifyContent: "center",
    gap: "3rem",
    marginTop: "2rem",
  },
  statItem: {
    textAlign: "center",
  },
  statNumber: {
    display: "block",
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: "0.5rem",
  },
  statLabel: {
    fontSize: "1rem",
    color: "#7f8c8d",
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

  // Featured Section
  featuredSection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  featuredGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "2rem",
  },
  featuredPost: {
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.3s ease",
  },
  featuredImage: {
    fontSize: "4rem",
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#f8f9fa",
  },
  featuredContent: {
    padding: "1.5rem",
  },
  featuredHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  featuredCategory: {
    backgroundColor: "#667eea",
    color: "white",
    padding: "0.25rem 0.75rem",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  featuredMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: "0.8rem",
    color: "#7f8c8d",
  },
  featuredDate: {
    marginBottom: "0.25rem",
  },
  featuredReadTime: {
    fontStyle: "italic",
  },
  featuredTitle: {
    color: "#2c3e50",
    fontSize: "1.4rem",
    marginBottom: "1rem",
    lineHeight: "1.3",
    fontWeight: "bold",
  },
  featuredExcerpt: {
    color: "#7f8c8d",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
  },
  featuredFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredAuthor: {
    color: "#667eea",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  featuredReadButton: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // Filter Section
  filterSection: {
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  filterContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  searchContainer: {
    marginBottom: "2rem",
    textAlign: "center",
  },
  searchInput: {
    width: "100%",
    maxWidth: "400px",
    padding: "1rem",
    border: "2px solid #e9ecef",
    borderRadius: "25px",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  categoryFilters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
  },
  categoryButton: {
    backgroundColor: "white",
    color: "#667eea",
    border: "2px solid #667eea",
    padding: "0.75rem 1.5rem",
    borderRadius: "25px",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "500",
  },
  categoryButtonActive: {
    backgroundColor: "#667eea",
    color: "white",
  },

  // Blog Section
  blogSection: {
    padding: "4rem 2rem",
    marginBottom: "4rem",
  },
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "2rem",
  },
  blogPost: {
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.3s ease",
  },
  postImage: {
    fontSize: "3rem",
    textAlign: "center",
    padding: "1.5rem",
    backgroundColor: "#f8f9fa",
  },
  postContent: {
    padding: "1.5rem",
  },
  postHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  category: {
    backgroundColor: "#667eea",
    color: "white",
    padding: "0.25rem 0.75rem",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  postMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: "0.8rem",
    color: "#7f8c8d",
  },
  date: {
    marginBottom: "0.25rem",
  },
  readTime: {
    fontStyle: "italic",
  },
  postTitle: {
    color: "#2c3e50",
    fontSize: "1.3rem",
    marginBottom: "1rem",
    lineHeight: "1.3",
    fontWeight: "bold",
  },
  postExcerpt: {
    color: "#7f8c8d",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
  },
  postFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postAuthor: {
    color: "#667eea",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  readMoreButton: {
    backgroundColor: "transparent",
    color: "#667eea",
    border: "2px solid #667eea",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // Newsletter Section
  newsletterSection: {
    padding: "4rem 2rem",
    backgroundColor: "#2c3e50",
    color: "white",
    marginBottom: "4rem",
    borderRadius: "50px 0 50px 0",
  },
  newsletterContent: {
    maxWidth: "800px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "3rem",
    alignItems: "center",
  },
  newsletterText: {
    flex: 1,
  },
  newsletterTitle: {
    fontSize: "2rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  newsletterSubtitle: {
    fontSize: "1.1rem",
    opacity: 0.9,
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  newsletterStats: {
    display: "flex",
    gap: "2rem",
  },
  newsletterStat: {
    textAlign: "center",
  },
  newsletterStatNumber: {
    display: "block",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ff6b6b",
  },
  newsletterStatLabel: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },
  newsletterForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  newsletterInput: {
    padding: "1rem",
    border: "none",
    borderRadius: "25px",
    fontSize: "1rem",
    outline: "none",
  },
  newsletterButton: {
    backgroundColor: "#ff6b6b",
    color: "white",
    border: "none",
    padding: "1rem",
    borderRadius: "25px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // Categories Section
  categoriesSection: {
    padding: "4rem 2rem",
    backgroundColor: "#f8f9fa",
    marginBottom: "4rem",
  },
  categoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  },
  categoryCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
  },
  categoryIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  categoryCardTitle: {
    color: "#2c3e50",
    fontSize: "1.3rem",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  categoryCardCount: {
    color: "#667eea",
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  categoryCardDescription: {
    color: "#7f8c8d",
    lineHeight: "1.6",
    fontSize: "0.9rem",
  },
};

export default Blog;
