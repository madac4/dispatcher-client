'use client';

import { Button } from '@/components/ui/button';
import { confirmEmail, resendConfirmationEmail } from '@/lib/services/authService';
import { CheckCircleIcon, Loader2Icon, MailIcon, XCircleIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ConfirmRegistrationPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleConfirmEmail(token);
    } else {
      setIsError(true);
      setErrorMessage('Invalid confirmation link');
    }
  }, [token]);

  const handleConfirmEmail = async (confirmationToken: string) => {
    setIsLoading(true);
    try {
      const { message } = await confirmEmail({ token: confirmationToken });
      setIsConfirmed(true);
      toast.success(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      const { message } = await resendConfirmationEmail({ email });
      toast.success(message);
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <Loader2Icon className="h-12 w-12 animate-spin text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Confirming your email...</h2>
        <p className="text-gray-600">Please wait while we confirm your email address.</p>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Email Confirmed!</h2>
          <p className="text-gray-600">
            Your email address has been successfully confirmed. You can now log in to your account.
          </p>
        </div>
        <Button onClick={handleGoToLogin} className="w-full max-w-xs">
          Go to Login
        </Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8">
        <div className="rounded-full bg-red-100 p-4">
          <XCircleIcon className="h-12 w-12 text-red-600" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Confirmation Failed</h2>
          <p className="text-gray-600">{errorMessage}</p>
        </div>
        <div className="w-full max-w-xs space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Enter your email to resend confirmation
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={handleResendConfirmation}
            disabled={isResending || !email}
            className="w-full"
            variant="outline"
          >
            {isResending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <MailIcon className="mr-2 h-4 w-4" />
                Resend Confirmation
              </>
            )}
          </Button>
          <Button onClick={handleGoToLogin} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
