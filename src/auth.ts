import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { compareSync } from "bcrypt-edge";
import { prisma } from "./lib/prisma";
import { loginSchema } from "./lib/schemas/loginSchema";
import { getUserByEmail } from "./app/actions/authActions";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    // 配置 session 后才能使用 auth() 获取到 session 数据，包括 username, email
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const validated = loginSchema.safeParse(credentials);

                if (validated.success) {
                    const { email, password } = validated.data;

                    const result = await getUserByEmail(email);
                    if (result.status === 'success') {
                        const user = result.data
                        if (compareSync(password, user.password)) {
                            return {
                                name: user.username,
                                email: user.email,
                            }
                        }
                    }
                }

                return null
            },
        }),
    ],
})