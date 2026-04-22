<template>
  <div class="home-container">
    <!-- Hero Section with Gradient Background -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Welcome to FurFam</h1>
        <p class="subtitle">Where Pets Find Their Perfect Match</p>
        
        <div v-if="!isUserLoggedIn" class="cta-buttons">
          <router-link :to="{ path: '/register', query: { role: 'careseeker' }}" class="primary-button">
            Find a Pet Sitter
          </router-link>
          <router-link :to="{ path: '/register', query: { role: 'caretaker' }}" class="secondary-button">
            Become a Caretaker
          </router-link>
        </div>
      
        <div v-else class="welcome-message">
          <p>Welcome back to your pet care platform!</p>
          
        </div>
      </div>
    </section>
    <!-- Services Overview (Reverted to Original) -->
    <section class="services-overview">
      <h2>Our Services</h2>
      <div class="services-grid">
        <div class="service-card">
          <div class="icon-container">
            <svg class="icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"></path>
            </svg>
          </div>
          <h3>Pet Boarding</h3>
          <p>Overnight care for your pets in a loving home environment</p>
        </div>

        <div class="service-card">
          <div class="icon-container">
            <svg class="icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"></path>
            </svg>
          </div>
          <h3>Day Care</h3>
          <p>Daytime supervision and play for your pets while you're away</p>
        </div>

        <div class="service-card">
          <div class="icon-container">
            <svg class="icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
            </svg>
          </div>
          <h3>Pet Walking</h3>
          <p>Regular exercise and outdoor time for your furry friends</p>
        </div>

        <div class="service-card">
          <div class="icon-container">
            <svg class="icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"></path>
            </svg>
          </div>
          <h3>Dog Training</h3>
          <p>Professional training to improve your dog's behavior and skills</p>
        </div>
      </div>
      <button @click="viewAllServices" class="primary-button services-button ">Explore All Services</button>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="section-header">
        <h2>What Pet Parents Say</h2>
        <p class="section-description">Trusted by thousands of pet owners</p>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
          <div class="testimonial-content">
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar">
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <p class="author-role">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to find the perfect pet sitter?</h2>
        <p>Join our community of trusted pet lovers today</p>
        <div class="cta-buttons-container">
          <router-link 
            :to="isUserLoggedIn ? '/caretakers' : { path: '/register', query: { role: 'careseeker' }}" 
            class="cta-button"
          >
            {{ isUserLoggedIn ? 'Find a Caretaker Now' : 'Get Started Today' }}
          </router-link>
          
          <router-link to="/contact" class="cta-button contact-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Contact Us
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      testimonials: [
        {
          text: 'FurFam made finding a reliable pet sitter so easy! My dog loves his new caretaker.',
          name: 'Puspa Gyawali',
          role: 'Pet Parent',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          text: 'As a caretaker, I\'ve met so many wonderful pets and their owners through FurFam.',
          name: 'Lucky Sherpa',
          role: 'Pet Caretaker',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          text: 'The peace of mind knowing my cat is in good hands is priceless.',
          name: 'Anjali Shrestha',
          role: 'Pet Parent',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
        }
      ]
    };
  },
  computed: {
    isUserLoggedIn() {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const storeToken = this.$store.state.auth && this.$store.state.auth.token;
      const user = this.$store.state.user;
      return !!token || !!storeToken || !!user;
    }
  },
  methods: {
    navigateToService(serviceType) {
      this.$router.push({
        path: '/services',
        query: { service: serviceType }
      });
    },
    viewAllServices() {
      this.$router.push('/services');
    }
  }
}
</script>

<style scoped>
.home-container {
  max-width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #f3e7fd 0%, #e3f0ff 100%);
  min-height: 50vh;
  display:flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #3a2e4f;
  padding: 0 2rem;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.05);
}

.hero-content {
  max-width: 800px;
}

.hero-section h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  color: #6b7280;
}

/* CTA Buttons */
.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.primary-button {
  background-color: #8b5cf6;
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.primary-button:hover {
  background-color: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.secondary-button {
  background-color: #ede9fe;
  color: #7c3aed;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  border: 2px solid #8b5cf6;
  cursor: pointer;
  font-size: 1.1rem;
}

.secondary-button:hover {
  background-color: #d1c4e9;
  color: #5b21b6;
  transform: translateY(-2px);
}

/* Services Overview (Reverted to Original) */
.services-overview {
  padding: 4rem 2rem;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.services-overview h2 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1f2937;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.service-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.icon-container {
  background-color: #f3f4f6;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.icon {
  width: 32px;
  height: 32px;
  color: #8b5cf6;
}

.service-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.service-card p {
  color: #6b7280;
  line-height: 1.5;
}

.services-button {
  margin-top: 1rem;
  font-size: 1.1rem;
}

/* Testimonials Section */
.testimonials-section {
  background: #f4f3ff;
  padding: 5rem 2rem 5rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 6px 32px rgba(139, 92, 246, 0.08);
  margin: 4rem auto 4rem auto;
  max-width: 1300px;
}

.testimonials-section .section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.testimonials-section .section-header h2 {
  font-size: 2.3rem;
  font-weight: 800;
  color: #5b21b6;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
}

.testimonials-section .section-header .section-description {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  background-color: #f9fafb;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.testimonial-text {
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info h4 {
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.author-role {
  font-size: 0.9rem;
  color: #6b7280;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  padding: 6rem 2rem;
  text-align: center;
  color: white;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.cta-section p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

/* New styles for CTA buttons container */
.cta-buttons-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.cta-button {
  background-color: white;
  color: #8b5cf6;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.contact-button {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.contact-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.contact-icon {
  margin-right: 8px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
  }
  
  .services-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-section {
    padding: 4rem 1.5rem;
  }
  
  .cta-section h2 {
    font-size: 2rem;
  }
  
  .cta-buttons-container {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    width: 100%;
    max-width: 250px;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-content,
.service-card,
.testimonial-card,
.cta-content {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>