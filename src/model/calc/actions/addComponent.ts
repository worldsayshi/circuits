export default function addComponent({ coordinates }: { coordinates : { x: number, y: number }}) {
  return ({
    type: 'ADD_COMPONENT',
    coordinates,
  });
}