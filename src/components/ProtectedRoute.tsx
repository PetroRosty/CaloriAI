import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Skeleton className="min-h-screen w-full flex items-center justify-center animate-fade-in">
        <div className="h-12 w-1/3 rounded bg-muted animate-pulse" />
      </Skeleton>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
