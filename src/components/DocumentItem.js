// src/components/DocumentItem.js
import React from "react";
import "./styles/DocumentItem.css";

const DocumentItem = ({ document }) => {
  return (
    <article className="DocCard">
      <div className="DocCardTop">
        <h3 className="DocTitle" title={document.title}>
          {document.title}
        </h3>
        <p className="DocDesc" title={document.description}>
          {document.description}
        </p>
      </div>

      <div className="DocActions">
        <a
          className="DocBtn DocBtnPrimary"
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver
        </a>

        <a className="DocBtn DocBtnGhost" href={document.url} download>
          Descargar
        </a>
      </div>
    </article>
  );
};

export default DocumentItem;
