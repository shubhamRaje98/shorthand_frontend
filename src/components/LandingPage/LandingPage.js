import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Info, 
  Mail, 
  Phone, 
  Clock, 
  FileText, 
  Shield, 
  HelpCircle, 
  ChevronRight,
  CheckCircle,
  Users,
  Building2
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';

// Import images from assets folder
import heroImage from '../../assets/hero_banner.png';
import aboutImage from '../../assets/exam_portal.png';
import logo from '../../Logo.ico'; // ✅ Added logo import

const LandingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      {/* Header/Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#home">
            {/* ✅ Logo added here */}
            <img 
              src={logo} 
              alt="ShorthandExam Portal Logo" 
              className="me-2"
              style={{ width: '50px', height: '50px' }}
            />
            <span className="fw-bold text-primary">ShorthandExam Portal</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="#home" onClick={() => scrollToSection('home')}>
                  <Home size={18} className="me-1" /> Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about" onClick={() => scrollToSection('about')}>
                  <Info size={18} className="me-1" /> About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact" onClick={() => scrollToSection('contact')}>
                  <Mail size={18} className="me-1" /> Contact
                </a>
              </li>
              <li className="nav-item ms-lg-3">
                <button
                  className="btn btn-primary px-4"
                  onClick={() => navigate('/login')}
                >
                  <Building2 size={18} className="me-2" />
                  Institute Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section position-relative">
        <div className="hero-overlay"></div>
        <div 
          className="hero-background" 
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="container position-relative">
          <div className="row min-vh-100 align-items-center">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h1 className="display-3 fw-bold mb-4 animate-fadeIn">
                Shorthand / Skill Test Examination Portal
              </h1>
              <p className="lead mb-5 fs-4 animate-fadeIn-delay" style={{ color: "black" }}>
                Register, download hall tickets, and manage institute access easily.
              </p>
              <div className="d-flex gap-3 justify-content-center animate-fadeIn-delay-2">
                <button 
                  className="btn btn-light btn-lg px-5 shadow"
                  onClick={() => scrollToSection('about')}
                >
                  Learn More <ChevronRight size={20} className="ms-2" />
                </button>
                <button 
                  className="btn btn-outline-light btn-lg px-5"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src={aboutImage} 
                alt="Exam Portal" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">
                What is the Shorthand/Skill Test Exam?
              </h2>
              <p className="lead text-muted mb-4">
                The Shorthand and Skill Test Examination is a comprehensive assessment designed to evaluate candidates' proficiency in shorthand writing, typing speed, and related clerical skills.
              </p>
              <div className="d-flex mb-3">
                <CheckCircle className="text-primary me-3 flex-shrink-0" size={24} />
                <div>
                  <h5 className="fw-bold">Professional Certification</h5>
                  <p className="text-muted">
                    Recognized certification for government and private sector positions
                  </p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <CheckCircle className="text-primary me-3 flex-shrink-0" size={24} />
                <div>
                  <h5 className="fw-bold">Skill Assessment</h5>
                  <p className="text-muted">
                    Evaluate typing speed, accuracy, and shorthand proficiency
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <CheckCircle className="text-primary me-3 flex-shrink-0" size={24} />
                <div>
                  <h5 className="fw-bold">Digital Platform</h5>
                  <p className="text-muted">
                    Seamless online registration and hall ticket generation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Who Can Apply */}
          <div className="row mt-5 pt-5">
            <div className="col-lg-12">
              <h2 className="display-5 fw-bold text-center mb-5">Who Can Apply?</h2>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                    <Users className="text-primary" size={40} />
                  </div>
                  <h4 className="fw-bold mb-3">Job Seekers</h4>
                  <p className="text-muted">
                    Candidates preparing for government clerical and stenographer positions requiring shorthand and typing skills.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                    <FileText className="text-success" size={40} />
                  </div>
                  <h4 className="fw-bold mb-3">Students</h4>
                  <p className="text-muted">
                    Students pursuing courses in stenography, secretarial practice, and office management seeking certification.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4">
                    <Building2 className="text-info" size={40} />
                  </div>
                  <h4 className="fw-bold mb-3">Institutes</h4>
                  <p className="text-muted">
                    Registered training institutes can manage student registrations, exam schedules, and hall ticket generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section id="contact" className="py-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">Contact & Support</h2>
                <p className="lead text-muted">
                  We're here to help. Reach out to us for any queries or assistance.
                </p>
              </div>

              <div className="row mb-5">
                <div className="col-md-4 mb-4">
                  <div className="card border-0 bg-primary bg-opacity-10 h-100 text-center p-4">
                    <Mail className="text-primary mx-auto mb-3" size={40} />
                    <h5 className="fw-bold mb-2">Email Support</h5>
                    <p className="text-muted mb-0">support@skilltestportal.com</p>
                    <p className="text-muted small">info@skilltestportal.com</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card border-0 bg-success bg-opacity-10 h-100 text-center p-4">
                    <Phone className="text-success mx-auto mb-3" size={40} />
                    <h5 className="fw-bold mb-2">Helpline</h5>
                    <p className="text-muted mb-0">+91-XXXX-XXXXXX</p>
                    <p className="text-muted small">Toll-Free Support</p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card border-0 bg-info bg-opacity-10 h-100 text-center p-4">
                    <Clock className="text-info mx-auto mb-3" size={40} />
                    <h5 className="fw-bold mb-2">Support Timing</h5>
                    <p className="text-muted mb-0">Monday - Friday</p>
                    <p className="text-muted small">9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              {/* <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="card border-0 shadow-lg">
                    <div className="card-body p-5">
                      <h4 className="fw-bold mb-4 text-center">Send us a Message</h4>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="form-label fw-semibold">Your Name</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="form-label fw-semibold">Email Address</label>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="form-label fw-semibold">Message</label>
                          <textarea
                            className="form-control form-control-lg"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="5"
                            placeholder="How can we help you?"
                            required
                          ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100">
                          Submit Message
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0">© 2025 ShorthandExam Portal. All rights reserved.</p>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-center justify-content-md-end gap-4 flex-wrap">
                <a href="#privacy" className="text-white text-decoration-none hover-link">
                  <Shield size={16} className="me-1" /> Privacy Policy
                </a>
                <a href="#terms" className="text-white text-decoration-none hover-link">
                  <FileText size={16} className="me-1" /> Terms & Conditions
                </a>
                <a href="#help" className="text-white text-decoration-none hover-link">
                  <HelpCircle size={16} className="me-1" /> Help & Support
                </a>
                <a href="#about" className="text-white text-decoration-none hover-link">
                  <Info size={16} className="me-1" /> About Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
