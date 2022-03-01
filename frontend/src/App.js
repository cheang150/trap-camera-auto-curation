import React, { useState } from "react";
import "./App.css";
import Overview from "./Components/Overview";
import Result from "./Components/Result";
import Upload from "./Components/Upload";

function App() {
  const [processing, setProcessing] = useState(null);
  const [shortlisted, setShortlisted] = useState([]);
  const [potential, setPotential] = useState([]);
  const [selections, setSelections] = useState([]);
  const [processedVideos, setProcessedVideos] = useState([]);
  const [statistics, setStatistics] = useState({
    framesAnalysed: 0,
    framesSelected: 0,
    invertebratesDetected: 0,
  });

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
        setStatistics={setStatistics}
      />
      {processing === null ? null : (
        <Result
          processing={processing}
          shortlisted={shortlisted}
          potential={potential}
          setShortlisted={setShortlisted}
          setPotential={setPotential}
          processedVideos={processedVideos}
          statistics={statistics}
        />
      )}
    </div>
  );
}

export default App;
