'use client';
import React, { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
// import { registerUser } from '@/app/lib/server/actions';

import { useRouter } from 'next/navigation';
import { SignUpErrorEnum } from '../lib/definitions/enums/enums';

interface SignUpErrorPropsInterface {
  error: SignUpErrorEnum;
}

const SignUpErrorComponent = () => {
  //   let errorMessage;
  //   switch (error) {
  //     case SignUpErrorEnum.ErrorSigningUp:
  //       errorMessage = 'Error signing up. Please try again.';
  //       break;
  //     case SignUpErrorEnum.SignUpFailure:
  //       errorMessage = 'Sign up failed. Please try again.';
  //       break;
  //     case SignUpErrorEnum.InvalidCredentialsFormat:
  //       errorMessage = 'Invalid credentials format. Please try again.';
  //       break;
  //     case SignUpErrorEnum.EmailOrPasswordIsMissing:
  //       errorMessage = 'Email or password is missing. Please try again.';
  //       break;
  //     default:
  //       errorMessage = 'An error occurred. Please try again.';
  //       break;
  //   }
  const errorMessage = 'An error occurred. Please try again.';
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-red-500 text-lg font-semibold">{errorMessage}</div>
      <button
        className="my-2 bg-primary-blue w-1/3 py-2 rounded-lg text-white font-semibold"
        onClick={() => {
          router.push('/');
        }}
      >
        Home
      </button>
    </div>
  );
};

const SignUpSuccessComponent = ({ email }: { email: string }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center border rounded-lg border-gray-300 p-20">
      <div className="text-primary-blue text-lg font-semibold  text-center">
        <span>Sign up successful!</span>
        <br></br>

        <span className="text-gray-700">
          Please check {email} for verification link.
        </span>
      </div>
      <button
        className="my-2 bg-primary-blue w-1/3 mt-6 py-2 rounded-lg text-white font-semibold"
        onClick={() => {
          router.push('/');
        }}
      >
        Home
      </button>
    </div>
  );
};

const SignUp = () => {
  // state - only returns if error occurs
  const [signUpStatus, setSignUpStatus] = useState<
    'idle' | 'success' | 'failure'
  >('idle');

  const [email, setEmail] = useState<string>('');

  //   let content;
  //   switch (signUpStatus) {
  //     case SignUpErrorEnum.SignUpSuccess:
  //       content = <SignUpSuccessComponent />;
  //       break;
  //     case SignUpErrorEnum.ErrorSigningUp:
  //     case SignUpErrorEnum.SignUpFailure:
  //     case SignUpErrorEnum.InvalidCredentialsFormat:
  //     case SignUpErrorEnum.EmailOrPasswordIsMissing:
  //       content = <SignUpErrorComponent error={signUpStatus} />;
  //       break;
  //     default:
  //       // default case, such as when no error has occurred yet, or the user hasn't submitted the form
  //       content = null;
  //       break;
  //   }

  const signUpSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget; // Should reference the form element

    // Now, use the form to create FormData
    const formData = new FormData(form);
    const email = formData.get('email') as string; // Cast to string
    const password = formData.get('password') as string; // Cast to string
    const username = formData.get('username') as string; // Cast to string

    // Now you can use email and password as needed
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Username:', username);

    // Callsignup api
    if (
      typeof email === 'string' &&
      email &&
      typeof password === 'string' &&
      password &&
      typeof username === 'string' &&
      username
    ) {
      try {
        const signupRes = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, username }),
        });

        if (!signupRes.ok) {
          throw new Error(`HTTP error! status: ${signupRes.status}`);
        }

        const data = await signupRes.json();
        if (data.success) {
          setSignUpStatus('success');
          setEmail(data.data.email);
        } else {
          setSignUpStatus('failure');
        }

        console.log('Sign up response:', data);
      } catch (error) {
        console.error('Error during signup:', error);
      }
    } else {
      // Handle the case where email or password is not provided...
      console.error('Email and password are required.');
    }
  };

  return (
    <div className="signUp min-w-screen min-h-screen flex items-center justify-center">
      {signUpStatus === 'idle' && (
        <div className="formContainer pb-20 w-1/3 flex flex-col items-center mx-10  border  rounded-lg">
          <div className="logo text-8xl mt-5 font-bold">aizen</div>
          <div className="logo text-2xl mt-2 mb-10">create. share. own.</div>
          <form
            onSubmit={signUpSubmitHandler}
            className="w-full flex flex-col justify-center items-center"
          >
            <div className="w-full mb-2 flex justify-center">
              <input
                className="peer block w-2/3 rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Email address"
                required
              />
            </div>
            <div className="w-full mt-2 mb-2 flex justify-center">
              <input
                className="peer block w-2/3 rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="username"
                type="string"
                name="username"
                placeholder="Username"
                required
              />
            </div>
            <div className="w-full  flex justify-center mt-2 mb-4">
              <input
                className="peer block w-2/3 rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <button
              className="my-2 bg-primary-blue w-1/3 py-2 rounded-lg text-white font-semibold"
              type="submit"
            >
              Sign up
            </button>
          </form>
        </div>
      )}
      {signUpStatus === 'success' && <SignUpSuccessComponent email={email} />}
      {signUpStatus === 'failure' && <SignUpErrorComponent />}
    </div>
  );
};

export default SignUp;
