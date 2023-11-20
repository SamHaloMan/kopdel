import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Register() {
    const router = useRouter();

    const handleRegister = async (event) => {
        event.preventDefault();
        const nickname = event.target.nickname.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            await axios.post('/api/auth/register', { nickname, email, password });
            router.push('/user/login');
        } catch (error) {
            // throw new Error('Invalid Format');
        }
    };

    return (
        <>
            <Head>
                <title>Register | KoDel</title>
                <meta name='description' content='KoDel Registration' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
                <div className="w-full p-8 rounded-md shadow-md lg:max-w-xl">
                    <h1 className="text-3xl font-bold text-center text-gray-400">KoDel</h1>
                    <form className="mt-6" onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label htmlFor="nickname" className="block text-sm font-semibold text-gray-300">
                                Nickname
                            </label>
                            <input
                                type="text"
                                name="nickname"
                                className="block w-full px-4 py-2 mt-2 text-gray-300 border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="block w-full px-4 py-2 mt-2 text-gray-300 border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="block w-full px-4 py-2 mt-2 text-gray-300 border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                required
                            />
                        </div>
                        <div className="mt-2">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 mt-8 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                                Register
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-sm text-center text-gray-500">
                        Do you have an account?{" "}
                        <Link href="/user/login" className="font-medium text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
