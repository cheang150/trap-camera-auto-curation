import React, { useState } from "react";
import "./App.css";
import Overview from "./Components/Overview";
import Result from "./Components/Result";
import Upload from "./Components/Upload";
import tree from "./img/tree.jpeg";
import sunset from "./img/sunset.jpeg";
import house from "./img/house.jpg";

function App() {
  const [processing, setProcessing] = useState(null);
  const [shortlisted, setShortlisted] = useState([tree, sunset, house]);
  const [potential, setPotential] = useState([tree, sunset, house]);
  const [selections, setSelections] = useState([]);
  const [processedVideos, setProcessedVideos] = useState([]);

  return (
    <div className="App">
      <Overview />
      <Upload
        setShortlisted={setShortlisted}
        setPotential={setPotential}
        setProcessing={setProcessing}
        selections={selections}
        setSelections={setSelections}
        setProcessedVideos={setProcessedVideos}
      />
      {processing === null ? null : (
        <Result
          processing={processing}
          shortlisted={shortlisted}
          potential={potential}
          setShortlisted={setShortlisted}
          setPotential={setPotential}
          processedVideos={processedVideos}
        />
      )}
    </div>
  );
}

export default App;
