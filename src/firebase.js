import { getApps, initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { firebaseConfiguration, firebaseConfigurationStatus, assertFirebaseAppConfiguration } from './firebase-mode.js'

// Emulator mode ignores ALL real-project configuration and never falls back.
const selected = firebaseConfiguration(import.meta.env)
export const emulatorMode = selected.emulator
export const firebaseProjectConfig = selected.config
const isConfigured = firebaseConfigurationStatus(firebaseProjectConfig).ready
const appName = emulatorMode ? 'dominance-emulator' : '[DEFAULT]'
const existing = getApps().find(app => app.name === appName)
if (isConfigured && !emulatorMode) assertFirebaseAppConfiguration(existing, firebaseProjectConfig)
const emulatorConnected = Symbol.for('dominance.localEmulatorsConnected')
if (emulatorMode && existing && (existing.options.projectId !== 'demo-dominance' || existing.options.apiKey !== 'demo-only-key' || !existing[emulatorConnected])) {
  throw new Error('Refusing to reuse a Firebase app without verified local emulator connections.')
}
export const firebaseApp = isConfigured ? (existing || initializeApp(firebaseProjectConfig, appName)) : null
export const auth = firebaseApp ? getAuth(firebaseApp) : null
export const db = firebaseApp ? getFirestore(firebaseApp) : null
if (emulatorMode && !existing) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', {disableWarnings:true})
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  firebaseApp[emulatorConnected] = true
}
// Unused optional services are isolated in firebase-optional.js.
// Keep the active account startup limited to Authentication and Firestore.
