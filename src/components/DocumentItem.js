// src/components/DocumentItem.js
import React from 'react';

const DocumentItem = ({ document }) => {
  return (
    <div style={itemStyle}>
      <h3 style={titleStyle}>{document.title}</h3>
      <p style={descriptionStyle}>{document.description}</p>
      <div style={buttonContainerStyle}>
        <a href={document.url} target="_blank" rel="noopener noreferrer" style={viewButtonStyle}>
          Ver
        </a>
        <a href={document.url} download style={downloadButtonStyle}>
          Descargar
        </a>
      </div>
    </div>
  );
};

const itemStyle = {
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s',
};

const titleStyle = {
  fontSize: '1.25em',
  marginBottom: '10px',
  color: '#333',
};

const descriptionStyle = {
  fontSize: '1em',
  marginBottom: '20px',
  color: '#555',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
};

const buttonStyle = {
  padding: '8px 16px',
  borderRadius: '5px',
  textDecoration: 'none',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const viewButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#007bff',
};

const downloadButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#28a745',
};

export default DocumentItem;
