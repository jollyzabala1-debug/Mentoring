import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "./prisma";

// ─── Validation Schema ───────────────────────────────────

const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

// ─── NextAuth Configuration ─────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials with Zod
          const validatedCredentials = await signInSchema.parseAsync(
            credentials
          );

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email },
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Compare password with stored hash
          const passwordMatch = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          );

          if (!passwordMatch) {
            throw new Error("Invalid email or password");
          }

          // Return user data
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof z.ZodError) {
            // Validation error
            return null;
          }
          // Any other error (including invalid credentials)
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to JWT token when user signs in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token data to session
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
});
