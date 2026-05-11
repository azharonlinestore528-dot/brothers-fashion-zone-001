'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, CheckCheck, Trash2 } from 'lucide-react';
import { getContactMessages } from '@/lib/db';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    setMessages(messages.map((m) => m.id === id ? { ...m, isRead: true } : m));
    toast.success('Marked as read');
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    setMessages(messages.filter((m) => m.id !== id));
    toast.success('Message deleted');
  };

  const filteredMessages = messages.filter((m) =>
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {['all', 'unread', 'read'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); }}
            className={`px-4 py-2 rounded-lg font-inter text-[13px] transition-all capitalize ${
              activeTab === tab
                ? 'bg-[#C9B99A] text-black font-semibold'
                : 'bg-[#1A1A1A] text-white/50 border border-[#2A2A2A] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full max-w-md h-10 pl-10 pr-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg font-inter text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9B99A]"
        />
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-inter text-[14px] text-white/40">No messages</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] border-b border-[#2A2A2A]">
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Name</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Email</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Message</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Date</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Status</th>
                <th className="text-left font-inter text-[11px] text-white/30 uppercase tracking-widest p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg, i) => (
                <motion.tr
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors ${!msg.is_read ? 'border-l-3 border-l-blue-500' : ''}`}
                >
                  <td className="p-3 font-inter text-[13px] text-white font-semibold">{msg.name}</td>
                  <td className="p-3 font-inter text-[12px] text-white/60">{msg.email}</td>
                  <td className="p-3 font-inter text-[13px] text-white/70 max-w-xs truncate">{msg.message}</td>
                  <td className="p-3 font-mono text-[12px] text-white/40">{new Date(msg.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="p-3">
                    <span className={`font-inter text-[11px] px-2 py-1 rounded-full ${msg.is_read ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>
                      {msg.is_read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      <a href={`mailto:${msg.email}?subject=Re: Your message`} className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors">
                        <Mail size={14} className="text-white/60" />
                      </a>
                      {msg.phone && (
                        <a href={`https://wa.me/91${msg.phone}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors">
                          <MessageCircle size={14} className="text-[#25D366]" />
                        </a>
                      )}
                      {!msg.is_read && (
                        <button onClick={() => markAsRead(msg.id)} className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors">
                          <CheckCheck size={14} className="text-white/60" />
                        </button>
                      )}
                      <button onClick={() => deleteMessage(msg.id)} className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] rounded-md hover:bg-white/[0.08] transition-colors">
                        <Trash2 size={14} className="text-white/60 hover:text-[#DC2626]" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}