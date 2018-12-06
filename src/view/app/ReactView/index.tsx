import * as React from "react";
import {connect} from "react-redux";
import D3Simulation from "./D3Simulation";
import withDragAndDrop from "./dragAndDrop";
import View from './View';
import TrivialSimulation from "./TrivialSimulation";

const ViewConfiguration = React.createContext({
  size: {
    width: 960,
    height: 900,
  },
});


function withViewConfiguration(Component) {
  return function ConnectedComponent(props) {
    return (
      <ViewConfiguration.Consumer>
        {conf => <Component {...conf} {...props}/>}
      </ViewConfiguration.Consumer>
    );
  }
}

export default connect(({
     graphContext,
     interaction: { mode }
}, {
    adaptor,
}) => {
  const { nodes, links, groups } = adaptor(graphContext);
  return { nodes, links, groups, interactionMode: mode };
}, dispatch => ({
  lockNode: (ix) => {
    dispatch({ type: 'TOGGLE_CONSTANT', index: ix});
    dispatch({ type: 'OPTIMIZE' });
  },
  incNode: (ix) => {
    dispatch({ type: 'INC_VALUE', index: ix});
    dispatch({ type: 'OPTIMIZE' });
  },
  addLink: ({ fromId, toId }) => {
    dispatch({ type: 'ADD_LINK', fromId, toId });
  },
}))(
  withViewConfiguration(
    withDragAndDrop(
      new TrivialSimulation(),
      View
    )
  ));