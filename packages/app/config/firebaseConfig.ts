// packages/app/firebaseConfig.ts
import { getApp } from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'

const firebaseApp = getApp()

const firebaseAuth = auth()

export { firebaseApp, firebaseAuth }
