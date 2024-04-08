'use client';
import React, { useState } from 'react';
import data from '@/app/lib/store/carousel.json';
import { Carousel } from 'react-bootstrap';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
// import LoginForm from '../dis-login/login-form';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useFormState, useFormStatus } from 'react-dom';
// import { authenticate } from '@/app/lib/server/actions';
import { useRouter } from 'next/navigation';
import { login } from '@/app/lib/server/actions';

const Hero = () => {
  const { bootstrap } = data.items;
  const [index, setIndex] = useState(0);
  //   const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const router = useRouter();

  const handleSelect = (
    selectedIndex: number,
    e: Record<string, unknown> | null
  ) => {
    setIndex(selectedIndex);
  };

  const signUpOnClickHandler = () => {
    console.log('Sign up clicked');
    router.push('/signup');
  };

  const signinSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    // Now, use the form to create FormData
    const email = formData.get('email') as string; // Cast to string
    const password = formData.get('password') as string; // Cast to string

    // Now you can use email and password as needed
    console.log('Email:', email);
    console.log('Password:', password);

    // Callsignin api
    if (
      typeof email === 'string' &&
      email &&
      typeof password === 'string' &&
      password
    ) {
      try {
        // const signinRes = await fetch('/api/signin', {
        await fetch('/api/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        // if (!signinRes.ok) {
        //   throw new Error(`HTTP error! status: ${signinRes.status}`);
        // }

        // const data = await signinRes.json();
        // if (data.success) {
        //   // route to home
        //   console.log('Sign in success');
        // }

        // console.log('Sign up response:', data);
      } catch (error) {
        console.error('Error during signup:', error);
      }
    } else {
      // Handle the case where email or password is not provided...
      console.error('Email and password are required.');
    }
  };

  return (
    <div className="heroContainer min-h-screen md:min-h-screen min-w-screen flex flex-row">
      <div className="leftHero w-1/2 min-h-screen md:min-h-screen flex justify-center items-center bg-blue-200">
        <Carousel
          className="mx-10 rounded-lg"
          activeIndex={index}
          onSelect={handleSelect}
        >
          {bootstrap.map((item) => (
            <Carousel.Item
              key={item.id}
              className="rounded-lg border border-gray-400"
              interval={4000}
            >
              <div className="relative w-full h-full">
                <img src={item.imageUrl} alt="slides" className="rounded-lg" />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <div className="rightHero w-1/2 min-h-screen md:min-h-screen flex flex-col  justify-center font-urbanist">
        <div className="formContainer flex flex-col items-center mx-10  border  rounded-lg">
          <div className="logo text-8xl mt-5 font-bold">aizen</div>
          <div className="logo text-2xl mt-2 mb-10">create. share. own.</div>
          <form
            // onSubmit={signinSubmitHandler}
            // action={login}
            className="w-full flex flex-col justify-center items-center"
          >
            <div className="w-full mb-2 flex justify-center">
              <input
                className="peer block w-2/3 rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Username or email address"
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
              type="submit"
              className="my-2 bg-primary-blue w-1/3 py-2 rounded-lg text-white font-semibold"
              formAction={login}
            >
              Login
            </button>
          </form>
          <div className="flex items-center justify-center my-4">
            <div className="flex-grow w-[50px] border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow w-[50px] border-t border-gray-300"></div>
          </div>
          <div className="text-primary-blue my-2">Login with Gmail</div>
          <div className="text-primary-blue mt-2 mb-4">
            Forgotten your password
          </div>
        </div>
        <div className="signUp border border-gray-400 mt-10 rounded-lg mx-10 flex flex-row items-center justify-center">
          <div className="my-4">Don&apos;t have an account</div>
          <button
            className="ml-2 text-primary-blue"
            onClick={signUpOnClickHandler}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
