//  This Custom HTTP-HOOK manages all the data passing, response status code checking and state management logic. So we don't have to repeat ourselves in the Auth.js and Users.js files
import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => { // In here we'll manage the loading and error state, so we can call them in Auth.js and Users.js files
    const [isLoading, setIsLoading] = useState(false); // Setting up new states to handle loading state and error state
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]); // In the case that we switch the page while we have an ongoing request, we want to cancel the ongoing http request. useRef here because we want to turn it into a reference. A reference is a piece of data which will not change/be reinitialized whren the code runs again. Stores data across rerendered cycles.

    const sendRequest = useCallback(async(url, method = 'GET', body = null, headers = {}) => { // The request need to be configurable, hence why we declare it with all these parameters.
        setIsLoading(true);
        const httpAbortCtrl = new AbortController(); // This is an API supported functionality built into modern browsers
        activeHttpRequests.current.push(httpAbortCtrl); // useRef always wraps the data we store in it in an object with a current property
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal // This basically links the httpAbortCtrl to this request and now we can use it to cancel the connected request, in the case that we switch page before the request is completed.
            });

            // Extract the response data and throw an error if we have a 400/500 error
            const responseData = await response.json(); // This returns a promise, hence why we need await keyword.

            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);

            if (!response.ok) {
                throw new Error(responseData.message); // If we get a 400/500 status code from the result of the fetch API execution, we make sure to throw an error. Because fetch API by defult technically just returns an error status code and not actually throw an error.
            }

            setIsLoading(false);
            return responseData;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err; // We throw the err here, so that the component that uses our hook will know that there is an error
        }
    }, []); // We used useCallback here to avoid infinte loops, so that this function never gets recreated when the component that uses this hook gets rerendered. This funciton has no specific dependencies, that's why we added an empty array.

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => { // This return function is executed as a cleanup function before the next time useEffect runs again, or also when the components that uses useEffect unmounts 
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []); // This outer function only runs when a component mounts

    return { isLoading, error, sendRequest, clearError };
};