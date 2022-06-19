import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

// If we use fetch() we will be fetching everytime the component rerenders which will lead to an infinite loop, so the useEffect() React hook comes in handy here, it makes sure we only rerender the component when certain defined criteria/dependencies change.
const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    // Using async directly on useEffect hook is not recommended, which is why we use an immediately-invoked / executed function expression (IIFE)
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/users'); // We use the fetch API inside the useEffect hook, so the code only runs once. With fetch(), the default request type is GET

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setLoadedUsers(responseData.users); // The responseData we get back is an array of users, as defined in the getUsers function in the backend users-controllers.js file
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []); // The code that runs is defined in the first argument and the second argument which is an array is a list of dependencies, i.e data that needs to change when the component rerenders. If the array is left empty, that means the component only run once

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
