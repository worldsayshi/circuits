import * as React from "react";
import { useState } from 'react';
import { connect } from "react-redux";
import InteractionMode from "../InteractionMode.enum";


function PaletteInt ({ switchMode, loadGraph, storeCurrent, interactionMode, clearGraph }) {
  const [graphName, setGraphName] = useState("");
  const interactionModes = Object.keys(InteractionMode as any);
  return <div>
    modes:
    <div>
      {interactionModes.map(mode => {
        return <button key={mode} onClick={() => switchMode(mode)}>{mode}</button>
      })}
      <button onClick={() => clearGraph()}>Clear graph</button>
      <input onChange={val => setGraphName(val.target.value)} value={graphName}/>
      <button onClick={() => loadGraph(graphName)}>Load graph</button>
      <button onClick={() => storeCurrent(graphName)}>Save graph</button>
    </div>
    selected mode: <div>{ interactionMode }</div>
  </div>;
}

export default PaletteInt;