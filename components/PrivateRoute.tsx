import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
    }
  }, [router]);

  return <>{children}</>;
}
