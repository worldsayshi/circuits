import InteractionMode from "../InteractionMode.enum";


/*
  TODO Merge ADD_COMPONENT into ADD_NODE so that ADD_NODE takes the node as input
  Add SELECT_BRUSH that takes node or component as input
 */

export default function interaction(state = {mode: 'DragNode'}, action) {
  switch (action.type) {
    case 'SWITCH_MODE': {
      return {
        ...state,
        mode: action.mode,
      };
    }
    case 'SELECT_BRUSH': {
      return {
        ...state,
        brush: action.brush,
      };
    }
    default:
      return state;
  }
}