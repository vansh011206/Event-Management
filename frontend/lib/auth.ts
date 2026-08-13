import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./mongodb";
import User from "./models/User";
import Admin from "./models/Admin";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();
        const normalizedEmail = credentials.email.toString().toLowerCase();

        // Check if admin credentials
        const admin = await Admin.findOne({ email: normalizedEmail });
        if (admin) {
          const isMatch = await bcrypt.compare(credentials.password.toString(), admin.password);
          if (isMatch) {
            return {
              id: admin._id.toString(),
              name: admin.name,
              email: admin.email,
              role: "admin",
            };
          }
        }

        // Check if standard user credentials
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
          const isMatch = await bcrypt.compare(credentials.password.toString(), user.password);
          if (isMatch) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role || "user",
            };
          }
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});
