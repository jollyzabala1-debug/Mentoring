import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { Role } from "@prisma/client"

// ─── Demo accounts (no DB required) ─────────────────────────────────────────
const DEMO_USERS = [
  { id: "demo-owner",      name: "Eric Santos",      email: "owner@ericartigos.com",      password: "owner123",      role: "OWNER"      as Role },
  { id: "demo-admin",      name: "Maria Cruz",       email: "admin@ericartigos.com",       password: "admin123",      role: "ADMIN"      as Role },
  { id: "demo-supervisor", name: "Juan Dela Cruz",   email: "supervisor@ericartigos.com",  password: "supervisor123", role: "SUPERVISOR" as Role },
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
        role:     { label: "Role",     type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // ── Demo login (no DB) ──────────────────────────────────────────────
        const demoUser = DEMO_USERS.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        )

        if (demoUser) {
          // Optional: enforce role match if passed from login form
          if (credentials.role && credentials.role !== demoUser.role) return null

          return {
            id:    demoUser.id,
            name:  demoUser.name,
            email: demoUser.email,
            role:  demoUser.role,
          }
        }

        // ── Real DB login (when DATABASE_URL is configured) ─────────────────
        try {
          const { default: prisma } = await import("@/lib/prisma")
          const bcrypt = await import("bcryptjs")

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user || user.status === "ARCHIVED") return null

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (!valid) return null

          if (credentials.role && credentials.role !== user.role) return null

          return {
            id:    user.id,
            name:  user.name,
            email: user.email,
            role:  user.role,
          }
        } catch {
          // DB not connected — only demo users are available
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id   = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role
        session.user.id   = token.id as string
      }
      return session
    },
  },
})
