import InteractionMode from "../InteractionMode.enum";


export default function interaction(state = {mode: 'DragNode'}, action) {
  switch (action.type) {
    case 'SWITCH_MODE':
      return {
        ...state,
        mode: action.mode,
      };
    default:
      return state;
  }
}