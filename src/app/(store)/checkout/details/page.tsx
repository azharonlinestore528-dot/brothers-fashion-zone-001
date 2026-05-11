'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

const FREE_SHIPPING_THRESHOLD = 599
const SHIPPING_COST = 49
const PLATFORM_FEE = 10

export default function CheckoutDetails() {
  const router = useRouter()
  const { items, getTotal } = useCartStore()
  
  const subtotal = getTotal()
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping + PLATFORM_FEE
  
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [landmark, setLandmark] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})

  const allIndianStates = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string,string> = {}
    
    if (fullName.trim().length < 2) newErrors.fullName = 'Enter your name'
    if (phone.trim().length !== 10) newErrors.phone = 'Enter 10 digit number'
    if (address.trim().length < 5) newErrors.address = 'Enter full address'
    if (city.trim().length < 2) newErrors.city = 'Enter city'
    if (!state) newErrors.state = 'Select state'
    if (pincode.trim().length !== 6) newErrors.pincode = 'Enter 6 digit pincode'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill all fields')
      return
    }
    
    const checkoutData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      state,
      pincode: pincode.trim(),
      landmark: landmark.trim(),
    }
    
    localStorage.setItem('bfz_checkout', JSON.stringify(checkoutData))
    
    toast.success('Proceeding to payment!')
    router.push('/checkout/payment')
  }

  const inputClass = `
    w-full h-14 px-4
    border-2 border-[#0A0A0A]
    bg-white text-base font-mono
    focus:outline-none
    focus:border-[#6B5CE7]
    focus:shadow-[3px_3px_0px_#6B5CE7]
  `

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
        <div className="text-center">
          <h1 className="font-black text-3xl mb-4 uppercase">Your Cart is Empty</h1>
          <Link href="/products" className="underline font-inter">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { num: 1, label: 'CART' },
            { num: 2, label: 'DETAILS' },
            { num: 3, label: 'PAYMENT' },
          ].map((step, i) => (
            <div key={step.num} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2"
                style={{
                  background: step.num <= 2 ? '#0A0A0A' : '#FFFFFF',
                  borderColor: step.num <= 2 ? '#0A0A0A' : '#E5E5E5',
                  color: step.num <= 2 ? '#FFFFFF' : '#999999'
                }}>
                {step.num}
              </div>
              <span className="font-bold text-xs uppercase"
                style={{ color: step.num <= 2 ? '#0A0A0A' : '#999999' }}>
                {step.label}
              </span>
              {i < 2 && <div className="w-10 h-0.5 bg-[#E5E5E5] ml-2" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-3">
            <div className="bg-[#FFD600] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] p-6 space-y-4">
              <h2 className="font-black text-xl uppercase mb-4">📦 DELIVERY TO</h2>

              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Full Name *"
                  className={inputClass}
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="h-14 px-4 border-2 border-[#0A0A0A] bg-white flex items-center font-bold font-mono whitespace-nowrap">
                  +91
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g,'').slice(0,10)
                      setPhone(v)
                    }}
                    placeholder="Phone Number *"
                    maxLength={10}
                    className={inputClass}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email (Optional)"
                className={inputClass}
              />

              <div>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Full Address *"
                  className={inputClass}
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City *"
                    className={inputClass}
                  />
                  {errors.city && (
                    <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select State *</option>
                    {allIndianStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-600 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={pincode}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g,'').slice(0,6)
                    setPincode(v)
                  }}
                  placeholder="Pincode *"
                  maxLength={6}
                  className={inputClass}
                />
                {errors.pincode && (
                  <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>
                )}
              </div>

              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="Landmark (Optional)"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="w-full h-16 mt-4 bg-[#0A0A0A] text-white font-black text-xl uppercase border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#FFD600] hover:shadow-[6px_6px_0px_#FFD600] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              PROCEED TO PAYMENT →
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] p-6 sticky top-6">
              <h2 className="font-black text-xl uppercase mb-4">ORDER SUMMARY</h2>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant.size}`} className="flex gap-3">
                    <div className="relative w-16 h-16 border-2 border-[#0A0A0A] flex-shrink-0">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#6B5CE7] text-white text-xs font-bold flex items-center justify-center border border-[#0A0A0A]">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm uppercase truncate">{item.name}</p>
                      <p className="font-mono text-xs text-gray-500">{item.variant.size}</p>
                    </div>
                    <span className="font-mono text-sm">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-[#0A0A0A] my-4" />

              <div className="font-mono text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-500 font-bold">FREE</span>
                  ) : (
                    <span>₹{shipping}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{PLATFORM_FEE}</span>
                </div>
              </div>

              <div className="border-t-2 border-[#0A0A0A] mt-4 pt-4 flex justify-between">
                <span className="font-black text-xl">TOTAL</span>
                <span className="font-black text-2xl">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}