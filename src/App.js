// src/App.js
import React from 'react';
import Header from './components/Header';
import DocumentList from './components/DocumentList';
import Footer from './components/Footer';
import './App.css'; // Asegúrate de importar los estilos CSS

import doc1 from './Documents/LagunaJordan_ValverdeAntony_Síntesis^N1.pdf';
import doc2 from './Documents/LagunaJordan_ValverdeRojas_Trabajo_Investigación^N1.pdf';
import doc3 from './Documents/Contaminación del agua por metales pesados.pdf';
import doc4 from './Documents/Presentación sobre diseños de investigación.pdf';
import doc5 from './Documents/Uso de la Inteligencia artificial en el desarrollo laboral en las Pymes de Costa Rica del 2021 - 2023(1).pdf';
import doc6 from './Documents/Uso de la Inteligencia artificial en el desarrollo laboral en las Pymes de Costa Rica del 2021 - 2023 (3).pdf';
import doc7 from './Documents/Librerías informáticas utilizadas en análisis de imágenes dermatológicas con visión computacional en las áreas de la medicina y sociedad.pdf';
import doc8 from './Documents/LagunaJordan_ValverdeRojas_Trabajo_Investigación^N3.pdf';
import doc9 from './Documents/LagunaJordan_ValverdeAntony_SíntesisN^N2.pdf';
import doc10 from './Documents/LagunaJordan_ValverdeRojas_Trabajo_Investigación^NN4.pdf';

function App() {
  const sintesis = [
    { title: 'Síntesis 1', description: 'Sociedad de la Información, Sociedad Digital, Sociedad de Control', url: doc1 },
    { title: 'Síntesis 2', description: 'Contaminación del agua por metales pesados', url: doc3 },
    { title: 'Síntesis 3', description: 'De tecnologías digitales y usos. Un recorrido por los desafíos actuales', url: doc9 },
  ];

  const investigaciones = [
    { title: 'Investigación 1', description: 'Instituto Mixto de Ayuda Social (IMAS), para combatir la desigualdad en acceso a la tecnología en la sociedad de Costa Rica 2019-2024', url: doc2 },
    { title: 'Investigación 2', description: 'Presentación sobre diseños de investigación.', url: doc4 },
    { title: 'Investigación 3', description: 'Uso de la Inteligencia artificial en el desarrollo laboral en las Pymes de Costa Rica del 2021 - 2023', url: doc6 },
    { title: 'Investigación 4', description: 'Librerías informáticas utilizadas en análisis de imágenes dermatológicas con visión computacional en las áreas de la medicina y sociedad', url: doc7 },
    { title: 'Investigación 5', description: 'Implementación de la Tecnología Digital para el desarrollo de habilidades en la educación costarricense 2019-2024', url: doc8 },
    { title: 'Investigación 6', description: 'Implementación de la tecnología inteligente para el desarrollo industrial del sector agrícola costarricense 2019-2024', url: doc10 },
  ];
  
  const articulos = [
    { title: 'Artículo científico 1', description: 'Uso de la Inteligencia artificial en el desarrollo laboral en las Pymes de Costa Rica del 2021 - 2023', url: doc5 },
  ];

  return (
    <div className="App">
      <Header />
      <section>
        <h2>Síntesis</h2>
        <DocumentList documents={sintesis} />
      </section>
      <section>
        <h2>Investigaciones</h2>
        <DocumentList documents={investigaciones} />
      </section>
      <section>
        <h2>Artículos Científicos</h2>
        <DocumentList documents={articulos} />
      </section>
      <Footer />
    </div>
  );
}

export default App;
