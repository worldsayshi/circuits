

# TODOs/snippets

## Modularize d3

This looks like the right way to do reusable d3 components
   https://medium.freecodecamp.org/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46

  Nope this is better, from botock himself:
  https://bost.ocks.org/mike/chart/
  
```
  let path = svg.selectAll(".link")
    .data(graph.links)
    .call(circuit.links);
```

##  Adapt d3 force layout to data changes

Example of how to adapt to data changes: https://bl.ocks.org/mbostock/1095795

```

```

## React like patching of json models?

To avoid having to know what changes to make (sort of impossible after redux)
in order to patch the d3 state, perhaps jsondiffpatch can be used?

https://github.com/benjamine/jsondiffpatch

## Using d3 with redux

https://bl.ocks.org/Fil/47678a37cc46fee9b3ed4769c31914e7

```
store.subscribe(() => {
  var state = store.getState();
   svg.select("text")
      .text(`${state.iteration}: ${state.counter}`)
  }
);
```