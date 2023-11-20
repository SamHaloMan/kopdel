import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Link from "next/link";
import Head from "next/head";

export default function Login() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) router.push('/');
    }, [session, router]);

    const handleLogin = async (event) => {
        event.preventDefault();
        const identifier = event.target.email.value;
        const password = event.target.password.value;

        const result = await signIn('credentials', {
            redirect: false,
            identifier,  
            password,
        });

        if (result.error) {
            throw new Error('Invalid Credentials');
        } else {
            router.push('/');
        }
    };

    return (
        <>
            <Head>
                <title>Login | KoDel</title>
                <meta name='description' content='KoDel Login' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
                <div className="w-full p-8 rounded-md shadow-md lg:max-w-xl">
                    <h1 className="text-3xl font-bold text-center text-gray-400">KoDel</h1>
                    <h5 className="text-xs font-bold text-center text-gray-400">KOPERASI DEL</h5>
                    <form className="mt-6" onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
                                Email or Nickname
                            </label>
                            <input
                                type="text"
                                name="email"
                                className="block w-full px-4 py-2 mt-2 text-gray-300 border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="block w-full px-4 py-2 mt-2 text-gray-300 border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <Link href="/user/forget-password" className="text-xs text-blue-600 hover:underline">
                            Forget Password?
                        </Link>
                        <div className="mt-2">
                            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                                Login
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-sm text-center text-gray-500">
                        Don't have an account?{" "}
                        <Link href="/user/register" className="font-medium text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                    <p className="mt-4 text-sm text-center text-gray-500">
                        <Link href="/" className="font-medium text-blue-600 hover:underline">
                            Go back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
