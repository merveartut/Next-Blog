// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Burada normalde veritabanına gidip kullanıcıyı kontrol edersin.
        // Test için dummy bir kullanıcı dönelim:
        if (
          credentials?.email === "admin@example.com" &&
          credentials?.password === "123456"
        ) {
          return { id: "1", name: "Admin User", email: "admin@example.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Kendi tasarımımız olan login sayfasını kullanacağız
  },
});

export { handler as GET, handler as POST };
