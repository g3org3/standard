import NextAuth, { type NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)
