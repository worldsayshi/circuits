import * as React from "react";
import { connect } from "react-redux";

function PaletteInt ({interactionMode}) {
  console.log('interactionMode', interactionMode);
  return <div>Selected mode: {interactionMode}</div>;
}

export default connect(({ interaction: { mode } }) => ({ interactionMode: mode }))(PaletteInt);