

export default function addCustomComponent({ coordinates, component }: { coordinates : { x: number, y: number }, component }) {
  return ({
    type: 'ADD_CUSTOM_COMPONENT',
    coordinates,
    component,
  });
};