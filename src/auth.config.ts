import NextAuth, {type NextAuthConfig} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import z from 'zod';
import { prisma } from './lib/prisma';
import bcryptjs from 'bcryptjs';
 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks:{
    jwt: async ({ token, user }) => {
      if (user) {
        token.data = user;
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      session.user = token.data as any;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      console.log('Auth', {auth});
      // const isLoggedIn = !!auth?.user;
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      return true;
    },
  },
  providers:[
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.email(), password: z.string().min(6) })
          .safeParse(credentials);

          if (!parsedCredentials.success) return null;
          const {email, password} = parsedCredentials.data;          

          // Buscar el correo
          const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
          if (!user) return null;

          // Comparar contraseñas
          if (!bcryptjs.compareSync(password, user.password)) return null;          
          
          // Regresar el usuario sin el password
          const { password: _, ...userWithoutPassword } = user;
          
          return userWithoutPassword;
      },
    }),
  ]
};

export const { signIn, signOut, auth, handlers } = NextAuth( authConfig );