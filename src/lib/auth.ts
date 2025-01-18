import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("JWT")
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("SESSION")
      return {
        ...session,
        accessToken: token.accessToken,
        idToken: token.idToken
      };
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("SIGNIN")
      console.log('Sign in callback:', { user, account, profile });
      return true;
    }
  }
};