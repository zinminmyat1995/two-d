import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  notifications: [], // ✅ new state for notifications
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }

    // ✅ Add notification to list
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, rest.payload],
      }

    case 'NOTIFICATION_CLICK':
      return {
        ...state,
        notifications: [...state.notifications, rest.payload],
      }

    // ✅ Clear all notifications
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      }

    default:
      return state
  }
}

const store = createStore(changeState)
export default store
