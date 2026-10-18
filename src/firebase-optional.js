// Reserved for future features: import this module on demand, never from account startup.
// Project settings are shared unchanged; these services remain unavailable in emulator mode.
import {getDatabase} from 'firebase/database'
import {getStorage} from 'firebase/storage'
import {firebaseApp,emulatorMode} from './firebase.js'
export const realtimeDb=firebaseApp&&!emulatorMode?getDatabase(firebaseApp):null
export const storage=firebaseApp&&!emulatorMode?getStorage(firebaseApp):null
