import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBQTuaByVsw4E3BfRD6Iyz91mPxS6-HqCM",
    authDomain: "twitter-clone-yt-b0025.firebaseapp.com",
    projectId: "twitter-clone-yt-b0025",
    storageBucket: "twitter-clone-yt-b0025.appspot.com",
    messagingSenderId: "169779623220",
    appId: "1:169779623220:web:50f0000286ebacc8f1a161"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps();
const db = getFirestore()
const storage = getStorage()

export default app;
export { db, storage }