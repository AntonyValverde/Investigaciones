// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContainerStyle}>
        <div style={creatorInfoStyle}>
          <h4>Sobre el creador</h4>
          <p>Este sitio web fue creado por Antony Valverde, apasionado por la tecnología y la investigación. 
          Soy un desarrollador web con experiencia en la creación de soluciones innovadoras.</p>
        </div>
        <div style={contactInfoStyle}>
          <h4>Contacto</h4>
          <ul style={contactListStyle}>
            <li>Email: <a href="antonyvalverde2003@gmail.com" style={linkStyle}>antonyvalverde2003@gmail.com</a></li>
            <li>LinkedIn: <a href="https://www.linkedin.com/in/antony-valverde-26a709274/" target="_blank" rel="noopener noreferrer" style={linkStyle}>Antony Valverde R.</a></li>
            <li>GitHub: <a href="https://github.com/AntonyValverde" target="_blank" rel="noopener noreferrer" style={linkStyle}>Antony Valverde R.</a></li>
          </ul>
        </div>
      </div>
      <div style={footerBottomStyle}>
        <p>© 2024. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#282c34',
  color: 'white',
  padding: '20px 0',
  textAlign: 'center',
  marginTop: '20px',
};

const footerContainerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  padding: '20px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const creatorInfoStyle = {
  flex: '1 1 300px',
  marginBottom: '20px',
  textAlign: 'left',
};

const contactInfoStyle = {
  flex: '1 1 300px',
  marginBottom: '20px',
  textAlign: 'left',
};

const contactListStyle = {
  listStyleType: 'none',
  padding: 0,
};

const linkStyle = {
  color: '#61dafb',
  textDecoration: 'none',
};

const footerBottomStyle = {
  borderTop: '1px solid #444',
  paddingTop: '10px',
};

export default Footer;
