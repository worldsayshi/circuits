import * as React from "react";
import { useState } from 'react';
import { connect } from "react-redux";
import InteractionMode from "../InteractionMode.enum";
import {
  Button,
} from 'rebass'
import Input from '../components/Input';

function PaletteInt ({ switchMode, loadGraph, storeCurrent, interactionMode, clearGraph }) {
  const [graphName, setGraphName] = useState("");
  const interactionModes = Object.keys(InteractionMode as any);
  return <div>
    modes:
    <div>
      {interactionModes.map(mode => {
        return <Button key={mode} onClick={() => switchMode(mode)}>{mode}</Button>
      })}
      <Button onClick={() => clearGraph()}>Clear graph</Button>
      <Input onChange={val => setGraphName(val.target.value)} value={graphName}/>
      <Button onClick={() => loadGraph(graphName)}>Load graph</Button>
      <Button onClick={() => storeCurrent(graphName)}>Save graph</Button>
    </div>
    selected mode: <div>{ interactionMode }</div>
  </div>;
}

export default PaletteInt;