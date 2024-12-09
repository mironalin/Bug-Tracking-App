import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();

export const { signIn, signOut, signUp, useSession } = authClient;

export type AuthContext = ReturnType<typeof useSession>;