import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  const dotIndex = originalName.lastIndexOf('.')
  const extension = dotIndex !== -1 ? originalName.slice(dotIndex) : ''
  return `${timestamp}-${random}${extension}`
}

export async function uploadFileToStorage(file: Blob, storagePath: string): Promise<string> {
  const fileRef = ref(storage, storagePath)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)
  return url
}
