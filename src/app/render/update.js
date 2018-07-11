function isIE() {
  return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
}

function groupCenter (bounds) {
  return {
    x: (bounds.X - bounds.x) / 2 + bounds.x,
    y: (bounds.Y - bounds.y) / 2 + bounds.y
  };
}

export default function update({ node, path, showGuides, group }) {
  path.each(function(d) {
    if (isIE()) this.parentNode.insertBefore(this, this);
  });
  // draw directed edges with proper padding from node centers
  path.attr('d', function(d) {
    let varNode = d.source.type === 'Var' ? d.source : d.target;
    let varGroup = varNode.parent;
    let gCenter = groupCenter(varGroup.bounds);

    let deltaX = d.target.x - d.source.x,
      deltaY = d.target.y - d.source.y,
      dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
      normX = deltaX / dist,
      normY = deltaY / dist,
      sourcePadding = 0, // nodeRadius,
      targetPadding = 0, //nodeRadius + 2,
      sourceX = d.source.x + (sourcePadding * normX),
      sourceY = d.source.y + (sourcePadding * normY),
      targetX = d.target.x - (targetPadding * normX),
      targetY = d.target.y - (targetPadding * normY);

    if (d.target.type === 'Var' && d.source.type === 'Var') {
      return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    }

    return 'M' + sourceX + ',' + sourceY + 'S' + gCenter.x + ',' + gCenter.y + ' ' + targetX + ',' + targetY;
  });

  node
  .attr('transform', function (d) {
    let transform = 'translate(' + d.x + ','+ d.y +')';
    if(d.type == 'Component') {
      let gc1 = groupCenter(d.parent.groups[0].bounds);
      let gc2 = groupCenter(d.parent.groups[1].bounds);

      let angle = Math.atan2(gc2.y - gc1.y, gc2.x - gc1.x) * 180 / Math.PI;
      return transform + ' rotate('+angle+')'
    }
    return transform;
  })


  if (showGuides) {
    group.attr("x", function(d) {
      return d.bounds.x;
    })
    .attr("y", function(d) {
      return d.bounds.y;
    })
    .attr("width", function(d) {
      return d.bounds.width();
    })
    .attr("height", function(d) {
      return d.bounds.height();
    });
  }
}