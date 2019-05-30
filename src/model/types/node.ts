import Component from "./component";
import Var from "./var";
import Socket from './socket';

type Node = Var | Component | Socket;

export default Node;