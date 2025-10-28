import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./client";

// 📦 Obtener todos los documentos de una colección
export async function getAll(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// 📄 Obtener un documento por ID
export async function getById(collectionName, id) {
  const ref = doc(db, collectionName, id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id, ...snapshot.data() } : null;
}

// ✏️ Modificar un documento por ID
export async function updateDocument(collectionName, id, data) {
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, data);
  return { id, ...data };
}

// Reemplaza o crea un documento con un ID fijo
export async function setDocument(collectionName, id, data) {
  const ref = doc(db, collectionName, id);
  await setDoc(ref, data, { merge: true });
  return { id, ...data };
}

// ➕ Agregar un nuevo documento
export async function addDocument(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), data);
  return { id: ref.id, ...data };
}
