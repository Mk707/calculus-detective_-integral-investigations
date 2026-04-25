import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from './config'

const provider = new GoogleAuthProvider()

export const signIn = () => signInWithPopup(auth, provider)
export const logOut = () => signOut(auth)