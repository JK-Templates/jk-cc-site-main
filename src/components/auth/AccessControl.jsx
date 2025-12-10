import React from 'react';
import { useAuth } from '@/lib/AuthContext';

export function AdminOnly({ children, fallback = null }) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAdmin) return fallback;

  return <>{children}</>;
}

export function RegisteredOnly({ children, fallback = null }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return fallback;

  return <>{children}</>;
}