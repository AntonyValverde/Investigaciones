// src/components/DocumentList.js
import React from 'react';
import DocumentItem from './DocumentItem';

const DocumentList = ({ documents }) => {
  return (
    <div style={gridStyle}>
      {documents.map((doc, index) => (
        <DocumentItem key={index} document={doc} />
      ))}
    </div>
  );
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  padding: '20px',
};

export default DocumentList;
