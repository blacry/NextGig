import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization, admin, twoFactor, emailOTP } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // set to true in production
    sendResetPassword: async ({ user, url }) => {
      // TODO: Wire up Resend
      console.log(`Password reset link for ${user.email}: ${url}`);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
    admin(),
    twoFactor({
      issuer: "NextGig",
    }),
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        // TODO: Wire up Resend
        console.log(`OTP for ${email}: ${otp}`);
      },
      expiresIn: 600, // 10 minutes
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // refresh every 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5-minute client-side cache
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
        input: true,
      },
    },
  },

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
