import * as React from "react";
import { connect } from "react-redux";
import InteractionMode from "../InteractionMode.enum";


function PaletteInt ({ switchMode, interactionMode }) {
  const interactionModes = Object.keys(InteractionMode as any);
  return <div>
    modes:
    <div>
      {interactionModes.map(mode => {
        return <button key={mode} onClick={() => switchMode(mode)}>{mode}</button>
      })}
    </div>
    selected mode: <div>{ interactionMode }</div>
  </div>;
}

export default connect(
  ({ interaction: { mode } }) => ({ interactionMode: mode }),
  (dispatch) => ({
    switchMode: (mode) => {
      dispatch({ type: 'SWITCH_MODE', mode });
    },
  })
)(PaletteInt);