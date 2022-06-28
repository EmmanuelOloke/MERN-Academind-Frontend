import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

// If we use fetch() we will be fetching everytime the component rerenders which will lead to an infinite loop, so the useEffect() React hook comes in handy here, it makes sure we only rerender the component when certain defined criteria/dependencies change.
const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    // Using async directly on useEffect hook is not recommended, which is why we use an immediately-invoked / executed function expression (IIFE)
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users'
        ); // We use the custom hook here to send request to the specified url

        setLoadedUsers(responseData.users); // The responseData we get back is an array of users, as defined in the getUsers function in the backend users-controllers.js file
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]); // The code that runs is defined in the first argument and the second argument which is an array is a list of dependencies, i.e data that needs to change when the component rerenders. If the array is left empty, that means the component only run once. Here now, sendRequest is a dependency of useEffect

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
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
