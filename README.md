

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

## 