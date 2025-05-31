'use server';

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { ActionResult } from "@/lib/types";
import { auth_user } from "@prisma/client";
import { hashSync } from 'bcrypt-edge'
import { AuthError, User } from "next-auth";

export async function getUserByUsername(username: string): Promise<ActionResult<auth_user>> {
    try {
        const result = await prisma.auth_user.findFirst({
            where: { username }
        })
        if (!result) {
            return { status: 'error', error: 'user not found' }
        }
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function getUserByEmail(email: string): Promise<ActionResult<auth_user>> {
    try {
        const result = await prisma.auth_user.findUnique({
            where: { email }
        })
        if (!result) {
            return { status: 'error', error: 'user not found' }
        }
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function registerUser(data: RegisterSchema): Promise<ActionResult<User>> {
    try {
        const validated = registerSchema.safeParse(data);

        if (!validated.success) {
            return { status: 'error', error: validated.error.errors }
        }

        const { username, email, password } = validated.data;

        const sameUsername = await getUserByUsername(username);
        if (sameUsername.status === 'success') {
            return { status: 'error', error: 'username has been used' }
        }

        const sameEmail = await getUserByEmail(email);
        if (sameEmail.status === 'success') {
            return { status: 'error', error: 'email has been used' }
        }

        const hashedPassword = hashSync(password, 10);

        const user = await prisma.auth_user.create({
            data: {
                password: hashedPassword,
                is_superuser: false,
                username,
                first_name: '',
                last_name: '',
                email,
                is_staff: false,
                is_active: true,
                date_joined: new Date(),
            }
        })

        return {
            status: "success", data: {
                name: user.username,
                email: user.email,
            }
        }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: 'internal error' }
    }
}

export async function signInUser(data: LoginSchema): Promise<ActionResult<string>> {
    try {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        })
        console.log(result)

        return { status: 'success', data: 'signin successfully' }
    } catch (error) {
        console.log(error)
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { status: 'error', error: 'invalid credentials' }

                default:
                    return { status: 'error', error: 'signin failed 1' }
            }
        }
        return { status: 'error', error: 'signin failed 2' }
    }
}

export async function signOutUser() {
    await signOut({ redirectTo: '/' })
}