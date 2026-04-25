import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCL07fYdmhIupj01VQflZ3eRFeP7G6semg",
  authDomain: "calcd-44e23.firebaseapp.com",
  projectId: "calcd-44e23",
  storageBucket: "calcd-44e23.firebasestorage.app",
  messagingSenderId: "1030452143665",
  appId: "1:1030452143665:web:a663a6815e5fccf1ba9710"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app