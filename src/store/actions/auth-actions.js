export const authActions = (isAdmin, token, expiresIn, userId, isLogin) => {
    return dispatch => {
        dispatch({
            type: 'SET_AUTH_DATA',
            payload: {
                isAdmin: isAdmin,
                token: token,
                expiresIn: expiresIn,
                userId: userId,
                isLogin: isLogin
            }
        });
    }
}

