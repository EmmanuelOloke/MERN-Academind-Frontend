import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Setting up new states to handle loading state and error state
  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        { ...formState.inputs, name: { value: '', isValid: false } },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  // Async function because we will work with a promise, and send a http request instead of just doing console.log(). For that we use the fetch() API.
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
    } else {
      try {
        setIsLoading(true); // Here we setIsLoading to true because now we are loading and we want the UI to re-render
        const response = await fetch('http://localhost:8000/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        }); // The fecth() API, which is provided by browsers in modern JS and used to send HTTP Requests. It takes a string that points at out Backend code

        const responseData = await response.json(); // This returns a promise, hence why we need await keyword.
        if (!response.ok) {
          throw new Error(responseData.message); // If we get a 400/500 status code from the result of the fetch API execution, we make sure to throw an error. Because fetch API by defult technically just returns an error status code and not actually throw an error.
        }
        console.log(responseData);
        setIsLoading(false); // We first clear the local state by setting isLoading to false before calling auth.login() because the state might change. Otherwise we might be updating a state on a component which is not on the screen anymore.
        auth.login(); // We only want to call auth.login() if we didn't have an error, hence why we do it here in the try block
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError(err.message || 'Something went wrong, please try again'); // If we have an error while loading we call the setError state.
      }
    }
    setIsLoading(false); // setIsLoading back to false here, because at this point loading is done.
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2> Login Required </h2> <hr />
        <form onSubmit={authSubmitHandler}>
          {' '}
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Enter your name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          )}{' '}
          <Input
            id="email"
            element="input"
            type="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />{' '}
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter a valid password with minimum of 8 characters."
            onInput={inputHandler}
          />{' '}
          <Button type="submit" disabled={!formState.isValid}>
            {' '}
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}{' '}
          </Button>{' '}
        </form>{' '}
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}{' '}
        </Button>{' '}
      </Card>
    </React.Fragment>
  );
};

export default Auth;
