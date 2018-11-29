import * as React from "react";

const simulation = <E extends object>(Cmp : React.ComponentType<E>) => (
  class WithSimulation extends React.Component<E> {
    render() {
      // TODO Move simulation in here!
      return <Cmp {...this.props} />
    }
  }
);

export default simulation;