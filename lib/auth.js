import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { app } from "./firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

export async function signUpWithEmail(name, email, password) {
  try {
    if (!email.endsWith("@iitg.ac.in")) {
      throw new Error("Only @iitg.ac.in emails are allowed.");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    await sendEmailVerification(userCredential.user);
    await signOut(auth);
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Error signing up:", error.message);
    return { user: null, error: error.message };
  }
}

export async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error("auth/email-not-verified");
    }
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Error signing in:", error.message);
    // This return statement is the crucial part that was likely missing
    return { user: null, error: error.message };
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
}

export async function getUserData(userId) {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return null;
  }
}