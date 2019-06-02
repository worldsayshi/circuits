import * as React from "react";
import { useState } from 'react';
import { connect } from "react-redux";
import InteractionMode from "../InteractionMode.enum";
import {
  Button,
} from 'rebass'
import Input from '../components/Input';
import Select from "../components/Select";
import Option from "../components/Option";
import Graph from "../../../model/types/graph";

interface PaletteProps {
  modes: string[],
  switchMode: (mode: string) => void,
  load: (name: string) => void,
  selectBrush: (name: string) => void,
  storeAs: (mode: string) => void,
  stored: string[],
  actions: {
    name: string,
    f: () => void,
  }[],
  selectedMode: string,
  selectedBrush: {
    name: string,
    brush: Graph
  },
}

const PaletteInt = ({ modes, switchMode, load, selectBrush, storeAs, actions, selectedMode, selectedBrush, stored }: PaletteProps) => {

  const [storageName, setStorageName] = useState("");
  const [selectedStored, selectStored] = useState(stored.length > 0 ? stored[0] : "");

  return <div>

    modes: (selected mode: <div>{ selectedMode }</div>)
    <div>
      {modes.map(mode => {
        return <Button key={mode} onClick={() => switchMode(mode)}>{mode}</Button>
      })}
    </div>

    actions:
    <div>
      {actions.map(action =>
        <Button key={action.name} onClick={() => action.f()}>
          {action.name}
        </Button>)}
      {/*<Button onClick={() => clearGraph()}>Clear graph</Button>
      <Button onClick={() => createComponent()}>Create component</Button>*/}
    </div>

    storage: (selected brush: <div>{ selectedBrush && selectedBrush.name }</div>)
    <div>
      <Input onChange={val => setStorageName(val.target.value)} value={storageName} />
      <Button onClick={() => load(selectedStored)}>Load graph</Button>
      <Button onClick={() => selectBrush(selectedStored)}>Select brush</Button>
      <Button onClick={() => storeAs(storageName)}>Save graph</Button>
      <Select onChange={val => selectStored(val.target.value)}>
        {stored.map(name =>
          <Option key={name} value={name}>{name}</Option>
        )}
      </Select>
    </div>

  </div>;
};

export default PaletteInt;