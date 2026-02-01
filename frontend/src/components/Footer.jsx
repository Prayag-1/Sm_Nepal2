import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetSettingsQuery } from "../slices/contactApiSlice";
import { FaWhatsapp, FaEnvelope, FaArrowUp, FaFacebookF, FaInstagram } from "react-icons/fa";
import logo from "../assets/logo.png";

const Footer = () => {
  const { data: settings } = useGetSettingsQuery();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mc-footer">
      <Container className="footer-top">
        <div className="footer-support">
          <Link to="/contact">Customer Support</Link>
        </div>
        <div className="social-row">
          <a href={settings?.facebook || "#"} aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href={settings?.instagram || "#"} aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href={settings?.whatsapp || "#"} aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
          <a href={`mailto:${settings?.contactEmail || ""}`} aria-label="Gmail">
            <FaEnvelope />
          </a>
        </div>
        <button className="back-top-link" onClick={scrollToTop}>
          Back to the top <FaArrowUp />
        </button>
      </Container>

      <Container className="footer-legal text-center">
        <div className="footer-nav">
          <span className="footer-line" aria-hidden />
          <div className="legal-links">
            <Link to="/about">About</Link>
            <Link to="/?view=brands">Brands</Link>
            <Link to="/tutorials">Resources</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
          <span className="footer-line" aria-hidden />
        </div>
      </Container>

      <Container className="footer-main">
        <Row className="align-items-center">
          <Col md={4} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center footer-brand">
              <Image src={logo} alt="Surgical Mart Nepal" height={48} className="me-2" />
              <div className="d-flex flex-column">
                <span className="fw-semibold text-white">Surgical Mart Nepal</span>
                <small className="text-muted">
                  {settings?.footerText ||
                    "Trusted medical supplies for hospitals, clinics, and caregivers across Nepal."}
                </small>
              </div>
            </div>
          </Col>
          <Col md={4} className="text-center text-muted">
            {settings?.contactEmail && (
              <div className="footer-contact-line">
                <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              </div>
            )}
            {settings?.contactPhone && (
              <div className="footer-contact-line">
                <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
              </div>
            )}
          </Col>
          <Col md={4} className="text-md-end text-center text-muted">
            Surgical Mart Nepal © {currentYear}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
