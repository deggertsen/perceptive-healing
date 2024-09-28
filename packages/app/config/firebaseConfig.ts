// packages/app/firebaseConfig.ts
import { initializeApp, ReactNativeFirebase } from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'

import { firebaseConfig } from './env'

const firebaseApp = initializeApp(firebaseConfig as ReactNativeFirebase.FirebaseAppOptions)

const firebaseAuth = auth()

export { firebaseApp, firebaseAuth }
