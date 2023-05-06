import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p className="footer-links">
        <a href="mailto:contact_support@domain.com" target="_blank">
          Need any help?
        </a>
      </p>
      <p>
        &copy; {currentYear} <strong>CreditOne</strong> - Organic Expenditure Store
      </p>
    </footer>
  );
};

export default Footer;
