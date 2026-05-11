'use client'
import { supabase } from './supabase'

export async function uploadImage(
  file: File,
  folder: string = 'products'
): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random()
    .toString(36).substring(2)}.${fileExt}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return data.publicUrl
}