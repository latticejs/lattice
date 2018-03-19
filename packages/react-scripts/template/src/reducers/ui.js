
import { UI_TOGGLE_NIGHT_MODE  } from '../constants/ui'

const initialState = {
  nightMode: false
}

export default (state = initialState, { type }) => {
  switch (type) {
    case UI_TOGGLE_NIGHT_MODE:
      return {
        ...state,
        nightMode: !state.nightMode
      }
    default:
      return state;
  }
}