// src/components/DocumentList.js
import React from "react";
import DocumentItem from "./DocumentItem";
import "./styles/DocumentList.css";

const DocumentList = ({ documents }) => {
  return (
    <div className="DocGrid">
      {documents.map((doc, index) => (
        <DocumentItem key={index} document={doc} />
      ))}
    </div>
  );
};

export default DocumentList;
