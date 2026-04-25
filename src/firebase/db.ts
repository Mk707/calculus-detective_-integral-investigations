import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './config'

export const initPlayer = async (uid: string, displayName: string) => {
  const ref = doc(db, 'players', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName,
      casesCompleted: 0,
      stats: {
        chaseSpeed: 0,
        evidenceWeight: 0,
        reactionTime: 0,
        visionRadius: 0
      }
    })
  }
}

export const updateStats = async (uid: string, statKey: string, amount: number) => {
  const ref = doc(db, 'players', uid)
  const snap = await getDoc(ref)
  const current = snap.data()!.stats
  await setDoc(ref, {
    stats: { ...current, [statKey]: current[statKey] + amount }
  }, { merge: true })
}

export const getPlayer = async (uid: string) => {
  const snap = await getDoc(doc(db, 'players', uid))
  return snap.data()
}