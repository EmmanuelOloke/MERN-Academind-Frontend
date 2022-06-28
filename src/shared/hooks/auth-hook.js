import { useState, useEffect, useCallback } from 'react';

let logoutTimer; // We declare it outside of the app because it's just some behind the scene variable that we need to manage and not something that will rerender the component or anything

export const useAuth = () => {

    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // This gives us a new date which is current date/time at login time plus 1 hour, since the expiration time we set on the backend is 1 hour
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString(),
            })
        ); // Using localStorage which is a browser functionality to store our token, so we don't get logged on every refresh. You can only write text or data that can be converted into text to the localStorage object, that's why we had to use JSON.stringify(). We also add the expiration key to store the expiration date which is one hour from login time, and used the .toISOString method to make sure no data gets lost when it's being stringified
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        // We set the timer here whenever the token changes, so the dependencies here are the token and the logout function, and the tokenExpirationDate. The token changes when we login or logout
        if (token && tokenExpirationDate) {
            const remainingTime =
                tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        // Adding a function to check the browser localStorage for a token once the app starts. The dependencies of the function is an empty array which means the function will only run once
        const storedData = JSON.parse(localStorage.getItem('userData')); // We use the getItem method on localStorageand pass in the key which we used to store the token, which in this case is userData. We use the JSON.parse method so we can convert JSON strings to regular JS DS like Object
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                new Date(storedData.expiration)
            );
        }
    }, [login]);

    return { token, login, logout, userId };
}