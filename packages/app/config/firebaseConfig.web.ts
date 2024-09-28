import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { firebaseConfig } from './env'

const firebaseApp = initializeApp(firebaseConfig as FirebaseOptions)

const firebaseAuth = getAuth(firebaseApp)

export { firebaseApp, firebaseAuth }
