// src/App.js
import React from "react";
import Header from "./components/Header";
import DocumentList from "./components/DocumentList";
import Footer from "./components/Footer";
import "./App.css";

import doc1 from "./Documents/LagunaJordan_ValverdeAntony_Síntesis^N1.pdf";
import doc2 from "./Documents/LagunaJordan_ValverdeRojas_Trabajo_Investigación^N1.pdf";
import doc3 from "./Documents/Contaminación del agua por metales pesados.pdf";
import doc4 from "./Documents/Presentación sobre diseños de investigación.pdf";
import doc5 from "./Documents/Uso de la Inteligencia artificial en el desarrollo laboral en las Pymes de Costa Rica del 2021 - 2023(1).pdf";
import doc6 from "./Documents/Uso de la Inteligencia artificial en el desarrollo laboral en las Pymes de Costa Rica del 2021 - 2023 (3).pdf";
import doc7 from "./Documents/Librerías informáticas utilizadas en análisis de imágenes dermatológicas con visión computacional en las áreas de la medicina y sociedad.pdf";
import doc8 from "./Documents/LagunaJordan_ValverdeRojas_Trabajo_Investigación^N3.pdf";
import doc9 from "./Documents/LagunaJordan_ValverdeAntony_SíntesisN^N2.pdf";
import doc10 from "./Documents/LagunaJordan_ValverdeRojas_Trabajo_Investigación^NN4.pdf";

function App() {
  const sintesis = [
    { title: "Síntesis 1", description: "Sociedad de la Información, Sociedad Digital, Sociedad de Control", url: doc1 },
    { title: "Síntesis 2", description: "Contaminación del agua por metales pesados", url: doc3 },
    { title: "Síntesis 3", description: "De tecnologías digitales y usos. Un recorrido por los desafíos actuales", url: doc9 },
  ];

  const investigaciones = [
    { title: "Investigación 1", description: "IMAS: desigualdad en acceso a la tecnología en Costa Rica 2019-2024", url: doc2 },
    { title: "Investigación 2", description: "Presentación sobre diseños de investigación.", url: doc4 },
    { title: "Investigación 3", description: "IA en el desarrollo laboral en Pymes de Costa Rica (2021-2023)", url: doc6 },
    { title: "Investigación 4", description: "Librerías de visión computacional aplicadas a dermatología (medicina y sociedad)", url: doc7 },
    { title: "Investigación 5", description: "Tecnología digital para habilidades en educación costarricense 2019-2024", url: doc8 },
    { title: "Investigación 6", description: "Tecnología inteligente para desarrollo industrial agrícola 2019-2024", url: doc10 },
  ];

  const articulos = [
    { title: "Artículo científico 1", description: "IA en el desarrollo laboral en Pymes de Costa Rica (2021-2023)", url: doc5 },
  ];

  const Section = ({ title, docs }) => (
    <section className="Section">
      <div className="SectionHeader">
        <h2 className="SectionTitle">{title}</h2>
        <p className="SectionMeta">{docs.length} documento(s)</p>
      </div>
      <DocumentList documents={docs} />
    </section>
  );

  return (
    <div className="App">
      <Header />
      <main className="AppMain">
        <Section title="Síntesis" docs={sintesis} />
        <Section title="Investigaciones" docs={investigaciones} />
        <Section title="Artículos Científicos" docs={articulos} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
