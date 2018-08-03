

# TODOs

## Refactor graph structure 

Refactor the internal graph data format so that components end up inside nodes array. There is no more components array.

Pro:
1. Allowing components to connect directly to other components (see `testGraph4-NewFormat.ts`)
2. (Perhaps) simpler conversion between internal and d3 format. Hmm, probably not.

Con:
1. Transaction cost


# Fixed TODOS

## Fix `optimizeGraph`
Current calculation is wrong because it allows solutions where disparate graphs can each have the wrong solution but the sum of them adds up to zero.

Need a way to handle disparate graphs and graphs consisting of multiple components. 

  1. As a good enough solution for now let's not deal with the possibility of zero input into a product component. Assume the optimizer can handle this.
  2. Separate disparate graphs (this can be done implicitly in the next step)
  3. Start from an arbitrary component and form an expression by traversing the graph
  4. Check if you've covered the entire graph.
  5. Go back to 3 and select a component that has not yet been selected.

The optimization function can be collected by emitting an expression instead of a function when traversing the graph. The expression should be interpretable by something like mathjs.


# Reference snippets

## Modularize d3

This looks like the right way to do reusable d3 components
   https://medium.freecodecamp.org/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46

  Nope this is better, from bostock himself:
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