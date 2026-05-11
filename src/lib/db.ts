import { supabase } from './supabase'

export async function addProduct(data: any) {
  const { error } = await supabase.from('products').insert(data)
  if (error) throw error
}

export async function getProducts(category?: string) {
  let q = supabase.from('products').select('*').eq('is_active', true)
  if (category) q = q.eq('category', category)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products').select('*')
    .eq('is_featured', true).eq('is_active', true)
  if (error) throw error
  return data || []
}

export async function getProductBySlug(slug: string) {
  const { data } = await supabase
    .from('products').select('*').eq('slug', slug).single()
  return data
}

export async function updateProduct(id: string, data: any) {
  const { error } = await supabase
    .from('products').update(data).eq('id', id)
  if (error) throw error
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products').delete().eq('id', id)
  if (error) throw error
}

export async function addCategory(data: any) {
  const { error } = await supabase.from('categories').insert(data)
  if (error) throw error
}

export async function getCategories() {
  const { data } = await supabase
    .from('categories').select('*').order('sort_order')
  return data || []
}

export async function updateCategory(id: string, data: any) {
  const { error } = await supabase
    .from('categories').update(data).eq('id', id)
  if (error) throw error
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

export async function addBrand(data: any) {
  const { error } = await supabase.from('brands').insert(data)
  if (error) throw error
}

export async function getBrands() {
  const { data } = await supabase.from('brands').select('*')
  return data || []
}

export async function updateBrand(id: string, data: any) {
  const { error } = await supabase
    .from('brands').update(data).eq('id', id)
  if (error) throw error
}

export async function deleteBrand(id: string) {
  const { error } = await supabase.from('brands').delete().eq('id', id)
  if (error) throw error
}

export async function addBanner(data: any) {
  const { error } = await supabase.from('banners').insert(data)
  if (error) throw error
}

export async function getBanners() {
  const { data } = await supabase
    .from('banners').select('*').eq('is_active', true)
  return data || []
}

export async function updateBanner(id: string, data: any) {
  const { error } = await supabase
    .from('banners').update(data).eq('id', id)
  if (error) throw error
}

export async function deleteBanner(id: string) {
  const { error } = await supabase.from('banners').delete().eq('id', id)
  if (error) throw error
}

export async function addReel(data: any) {
  const { error } = await supabase.from('reels').insert(data)
  if (error) throw error
}

export async function getReels() {
  const { data } = await supabase.from('reels').select('*')
  return data || []
}

export async function updateReel(id: string, data: any) {
  const { error } = await supabase
    .from('reels').update(data).eq('id', id)
  if (error) throw error
}

export async function deleteReel(id: string) {
  const { error } = await supabase.from('reels').delete().eq('id', id)
  if (error) throw error
}

export async function addVideo(data: any) {
  const { error } = await supabase.from('videos').insert(data)
  if (error) throw error
}

export async function getVideos() {
  const { data } = await supabase.from('videos').select('*')
  return data || []
}

export async function deleteVideo(id: string) {
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (error) throw error
}

export async function addOrder(data: any) {
  const { data: result, error } = await supabase
    .from('orders').insert(data).select().single()
  if (error) throw error
  return result
}

export async function getOrders() {
  const { data } = await supabase
    .from('orders').select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from('orders')
    .update({ order_status: status }).eq('id', id)
  if (error) throw error
}

export async function updateOrder(id: string, data: any) {
  const { error } = await supabase.from('orders')
    .update(data).eq('id', id)
  if (error) throw error
}

export async function addContactMessage(data: any) {
  const { error } = await supabase.from('contact_messages').insert(data)
  if (error) throw error
}

export async function getContactMessages() {
  const { data } = await supabase
    .from('contact_messages').select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function addCoupon(data: any) {
  const { error } = await supabase.from('coupons').insert(data)
  if (error) throw error
}

export async function getCoupons() {
  const { data } = await supabase.from('coupons').select('*')
  return data || []
}

export async function updateCoupon(id: string, data: any) {
  const { error } = await supabase
    .from('coupons').update(data).eq('id', id)
  if (error) throw error
}

export async function deleteCoupon(id: string) {
  const { error } = await supabase.from('coupons').delete().eq('id', id)
  if (error) throw error
}