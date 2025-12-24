// src/components/Footer.js
import React from "react";
import "./styles/Footer.css";

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="FooterInner">
        <div className="FooterCol">
          <h4 className="FooterTitle">Sobre el creador</h4>
          <p className="FooterText">
            Este sitio web fue creado por Antony Valverde, apasionado por la tecnología y la investigación.
            Desarrollador web enfocado en construir soluciones claras y útiles.
          </p>
        </div>

        <div className="FooterCol">
          <h4 className="FooterTitle">Contacto</h4>
          <ul className="FooterList">
            <li>
              Email:{" "}
              <a className="FooterLink" href="mailto:antonyvalverde2003@gmail.com">
                antonyvalverde2003@gmail.com
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a
                className="FooterLink"
                href="https://www.linkedin.com/in/antony-valverde-26a709274/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Antony Valverde R.
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                className="FooterLink"
                href="https://github.com/AntonyValverde"
                target="_blank"
                rel="noopener noreferrer"
              >
                AntonyValverde
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="FooterBottom">
        <p>© 2024. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
