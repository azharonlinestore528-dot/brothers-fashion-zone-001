'use client';

import { useState } from 'react';

interface UseAuthReturn {
  user: null;
  session: null;
  loading: boolean;
  initials: string;
  isLoggedIn: boolean;
}

export function useAuth(): UseAuthReturn {
  const [loading] = useState(false);

  return {
    user: null,
    session: null,
    loading,
    initials: '',
    isLoggedIn: false,
  };
}
