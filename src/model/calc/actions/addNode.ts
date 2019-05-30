
export default function addNode({ coordinates }: { coordinates : { x: number, y: number }}) {
  return ({
    type: 'ADD_NODE',
    coordinates,
  });
}