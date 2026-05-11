'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { uploadImage } from '@/lib/uploadImage';

const TABS = ['store_info', 'logo', 'payment', 'shipping', 'social', 'admin_access'];

const DEFAULT_SETTINGS = {
  store_name: "Brother's Fashion Zone",
  owner_email: 'brotherfashion@gmail.com',
  phone: '+91 81410 01555',
  logo_url: '',
  upi_id: 'ashokpatela119-1@oksbi',
  upi_name: 'Ashok Ashokpatel',
  free_delivery_threshold: '599',
  delivery_charge: '49',
  delivery_days: '3–5 business days',
  whatsapp_number: '+91 81410 01555',
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('store_info');
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bfz_settings');
    if (saved) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
    }
  }, []);

  const saveSetting = async (key: string, value: string) => {
    setLoading(true);
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      localStorage.setItem('bfz_settings', JSON.stringify(newSettings));
      toast.success('Setting saved!');
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLogoUploading(true);
    try {
      const url = await uploadImage(file, 'logo');
      
      const newSettings = { ...settings, logo_url: url };
      setSettings(newSettings);
      localStorage.setItem('bfz_settings', JSON.stringify(newSettings));
      
      toast.success('Logo updated!');
    } catch (err: any) {
      console.error('Logo upload error:', err);
      toast.error(err.message || 'Failed to upload logo');
    } finally {
      setLogoUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-[24px] text-white">Settings</h2>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-inter text-[13px] transition-all capitalize ${
              activeTab === tab
                ? 'bg-[#C9B99A] text-black font-semibold'
                : 'bg-[#1A1A1A] text-white/50 border border-[#2A2A2A] hover:text-white'
            }`}
          >
            {tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        {activeTab === 'store_info' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">Store Name</label>
              <input
                type="text"
                value={settings.store_name || "Brother's Fashion Zone"}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">Owner Email</label>
              <input
                type="email"
                value={settings.owner_email || 'brotherfashion@gmail.com'}
                onChange={(e) => setSettings({ ...settings, owner_email: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">Phone</label>
              <input
                type="tel"
                value={settings.phone || '+91 81410 01555'}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <button
              onClick={() => saveSetting('store_name', settings.store_name || '')}
              disabled={loading}
              className="bg-[#C9B99A] text-black font-inter text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#B8A88A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="max-w-lg">
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-4 font-inter">
              WEBSITE LOGO
            </label>
            
            <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6 text-center">
              {settings.logo_url ? (
                <div className="relative w-[240px] h-[100px] mx-auto bg-[#0A0A0A] rounded-lg overflow-hidden">
                  <Image
                    src={settings.logo_url}
                    alt="Current logo"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-[240px] h-[100px] mx-auto bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg flex items-center justify-center">
                  <span className="text-white/40 font-inter text-sm">No logo uploaded</span>
                </div>
              )}
              
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="mt-4 px-4 py-2 border border-[#C9B99A] text-[#C9B99A] bg-transparent rounded-lg font-inter text-sm hover:bg-[#C9B99A] hover:text-black transition-colors disabled:opacity-50"
              >
                {logoUploading ? 'Uploading...' : 'Change Logo'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">UPI ID</label>
              <input
                type="text"
                value={settings.upi_id || 'ashokpatela119-1@oksbi'}
                onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">UPI Name</label>
              <input
                type="text"
                value={settings.upi_name || 'Ashok Ashokpatel'}
                onChange={(e) => setSettings({ ...settings, upi_name: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                value={settings.free_delivery_threshold || 599}
                onChange={(e) => setSettings({ ...settings, free_delivery_threshold: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">Standard Delivery Charge (₹)</label>
              <input
                type="number"
                value={settings.delivery_charge || 49}
                onChange={(e) => setSettings({ ...settings, delivery_charge: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <button
              onClick={() => saveSetting('upi_id', settings.upi_id || '')}
              disabled={loading}
              className="bg-[#C9B99A] text-black font-inter text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#B8A88A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Payment Settings'}
            </button>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">Estimated Delivery Days</label>
              <input
                type="text"
                value={settings.delivery_days || '3–5 business days'}
                onChange={(e) => setSettings({ ...settings, delivery_days: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp_number || '+91 81410 01555'}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <button
              onClick={() => saveSetting('delivery_days', settings.delivery_days || '')}
              disabled={loading}
              className="bg-[#C9B99A] text-black font-inter text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#B8A88A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Shipping Settings'}
            </button>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="https://instagram.com/brothers_fashion_zone_"
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">Facebook URL</label>
              <input
                type="url"
                value={settings.facebook_url || ''}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">YouTube URL</label>
              <input
                type="url"
                value={settings.youtube_url || ''}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white focus:outline-none focus:border-[#C9B99A]"
              />
            </div>
            <button
              onClick={() => saveSetting('instagram_url', settings.instagram_url || '')}
              disabled={loading}
              className="bg-[#C9B99A] text-black font-inter text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-[#B8A88A] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Social Settings'}
            </button>
          </div>
        )}

        {activeTab === 'admin_access' && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block font-inter text-[13px] text-white/60 mb-2">Current Admin Email</label>
              <input
                type="email"
                value={process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@brothersfashion.com'}
                readOnly
                className="w-full h-12 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg font-inter text-[14px] text-white/40"
              />
            </div>
            <p className="font-inter text-[12px] text-white/40">
              To change credentials, update the .env.local file and restart the server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}