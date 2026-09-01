import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

export const isFirebaseAdminConfigured = () =>
  Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );

const initFirebaseAdmin = (): { auth: Auth | null; db: Firestore | null } => {
    const apps = getApps();

    if (apps.length) {
        return {
            auth: getAuth(),
            db: getFirestore(),
        };
    }

    if (!isFirebaseAdminConfigured()) {
        console.warn(
            "Firebase Admin is not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to .env.local to enable sign-in."
        );
        return { auth: null, db: null };
    }

    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            })
        });
        console.log("Firebase Admin initialized successfully");
        return {
            auth: getAuth(),
            db: getFirestore(),
        };
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
        return { auth: null, db: null };
    }
}

export const { auth, db } = initFirebaseAdmin();
