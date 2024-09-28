import { ReactNativeFirebase } from '@react-native-firebase/app'

export const firebaseConfig: ReactNativeFirebase.FirebaseAppOptions = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ?? '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ?? '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ?? '',
}
