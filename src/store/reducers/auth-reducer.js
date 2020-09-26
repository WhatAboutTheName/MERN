const initState = {
    isAdmin: false,
    token: null,
    userId: null,
    isLogin: false
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SET_AUTH_DATA':
      return {
        ...state,
        isAdmin: action.payload.isAdmin,
        token: action.payload.token,
        userId: action.payload.userId,
        isLogin: action.payload.isLogin
      }
    default:
      return state
  }
}

export default authReducer;