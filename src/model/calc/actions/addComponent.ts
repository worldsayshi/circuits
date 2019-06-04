import {getVerbData} from "../../components";

const defaultComponent = { left: [], right: [], verb: 'sum', type: 'Component', ...getVerbData()['sum'], };

export default function addComponent({ coordinates, component = defaultComponent }: { coordinates : { x: number, y: number }, component? }) {
  return ({
    type: 'ADD_COMPONENT',
    coordinates,
    component,
  });
}