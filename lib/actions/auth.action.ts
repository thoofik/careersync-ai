'use server';

import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

const LOCAL_DEV_USER = {
    id: "local-dev",
    name: "Local User",
    email: "local@dev",
    portal: "student" as UserPortal,
} as User;

const firebaseReady = () => Boolean(auth && db);

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    if (!firebaseReady()) {
        return {
            success: false,
            message: "Firebase Admin is not configured. Add credentials to .env.local.",
        };
    }

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email,
            portal: params.portal || "student",
        })

        return {
            success: true,
            message: 'Account created successfully. Please sign in.'
        }
    } catch (e: any) {
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken, portal } = params;

    if (!firebaseReady()) {
        return {
            success: false,
            message: "Firebase Admin is not configured. Add credentials to .env.local.",
        };
    }

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        const profile = await db.collection("users").doc(userRecord.uid).get();
        const accountPortal = (profile.data()?.portal as UserPortal | undefined) || "student";
        const wanted = portal || "student";
        if (accountPortal !== wanted) {
            return {
                success: false,
                message:
                    accountPortal === "industry"
                        ? "This is an industry account. Sign in on the Industry page."
                        : accountPortal === "college"
                          ? "This is a college account. Sign in on the College page."
                          : "This is a student account. Sign in on the student page.",
            };
        }

        await setSessionCookie(idToken);
        return { success: true };
    } catch (e) {
        console.log(e);

        return {
            success: false,
            message: 'Failed to log into an account.'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    if (!auth) {
        throw new Error("Firebase Admin is not configured.");
    }

    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
    cookieStore.delete("session");
}

export async function resetPassword(email: string) {
    if (!auth) {
        return {
            success: false,
            message: "Firebase Admin is not configured. Add credentials to .env.local.",
        };
    }

    try {
        // Check if user exists
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: 'No account found with this email address.'
            }
        }

        // For server-side password reset, we need to use Firebase Admin
        // Since Firebase doesn't have server-side password reset, we return success
        // and the client-side will handle the actual email sending
        return {
            success: true,
            message: 'If an account with this email exists, a password reset link has been sent.'
        }
    } catch (error: any) {
        console.error('Error in password reset:', error);

        if (error.code === 'auth/user-not-found') {
            return {
                success: true, // For security, don't reveal if email exists
                message: 'If an account with this email exists, a password reset link has been sent.'
            }
        }

        return {
            success: false,
            message: 'Failed to send password reset email. Please try again.'
        }
    }
}

export async function getCurrentUser(): Promise<User | null> {
    if (!firebaseReady()) {
        return process.env.NODE_ENV === "production" ? null : LOCAL_DEV_USER;
    }

    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.
            collection('users')
            .doc(decodedClaims.uid)
            .get();

        if(!userRecord.exists) return null;

        const data = userRecord.data() as Omit<User, "id">;
        return {
            ...data,
            id: userRecord.id,
            portal: data.portal || "student",
        } as User;
    } catch (e) {
        console.log(e)

        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}

export async function isIndustryUser() {
    const user = await getCurrentUser();
    return user?.portal === "industry";
}