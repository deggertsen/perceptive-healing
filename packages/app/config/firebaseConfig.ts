// packages/app/firebaseConfig.ts
import { initializeApp, ReactNativeFirebase } from '@react-native-firebase/app'
import { firebaseConfig } from './env'

const firebaseApp = initializeApp(firebaseConfig as ReactNativeFirebase.FirebaseAppOptions)

export { firebaseApp }
