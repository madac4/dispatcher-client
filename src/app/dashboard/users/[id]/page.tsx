'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRole } from '@/lib/models/auth.model';
import { UserDetailWithSettings } from '@/lib/models/user.model';
import { UserService } from '@/lib/services/userService';
import { formatDate } from 'date-fns';
import {
  ArrowLeft,
  Ban,
  Building2,
  CheckCircle,
  FileText,
  Hash,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Unlock,
  User,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return 'bg-red-100 text-red-800';
    case UserRole.MODERATOR:
      return 'bg-blue-100 text-blue-800';
    case UserRole.USER:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.MODERATOR:
      return 'Moderator';
    case UserRole.USER:
      return 'User';
    default:
      return role;
  }
};

const getStatusColor = (isEmailConfirmed: boolean) => {
  return isEmailConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
};

const getStatusIcon = (isEmailConfirmed: boolean) => {
  return isEmailConfirmed ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />;
};

const getStatusLabel = (isEmailConfirmed: boolean) => {
  return isEmailConfirmed ? 'Active' : 'Pending';
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  valueClassName?: string;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />

      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={`text-sm text-foreground mt-1 ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetailWithSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocking, setIsBlocking] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await UserService.getUserById(userId);
      setUser(response.data);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleToggleBlock = async () => {
    if (!user) return;

    try {
      setIsBlocking(true);
      const response = await UserService.toggleUserBlock(userId);
      if (response.success) {
        setUser({ ...user, isBlocked: response.data?.isBlocked || false });
        toast.success(
          response.message || `User ${response.data?.isBlocked || false ? 'blocked' : 'unblocked'} successfully`,
        );
      }
    } finally {
      setIsBlocking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">User not found</h2>
        <p className="text-muted-foreground mb-6">The user you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const displayName = user.companyInfo?.name || user.email.split('@')[0];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>

          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {displayName}
              <Badge className={`text-xs ${getRoleColor(user.role)}`}>{getRoleLabel(user.role)}</Badge>
              <Badge className={`text-xs ${getStatusColor(user.isEmailConfirmed)} flex items-center gap-1`}>
                {getStatusIcon(user.isEmailConfirmed)}
                {getStatusLabel(user.isEmailConfirmed)}
              </Badge>
              {user.isBlocked && (
                <Badge className="text-xs bg-red-100 text-red-800 flex items-center gap-1">
                  <Ban className="h-3 w-3" />
                  Blocked
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">Registered on {formatDate(user.createdAt, 'MMM d, yyyy')}</p>
          </div>
        </div>

        <Button variant={user.isBlocked ? 'default' : 'destructive'} onClick={handleToggleBlock} disabled={isBlocking}>
          {user.isBlocked ? (
            <>
              <Unlock className="h-4 w-4 mr-2" />
              Unblock User
            </>
          ) : (
            <>
              <Ban className="h-4 w-4 mr-2" />
              Block User
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="py-4 gap-4">
          <CardHeader className="px-4 [.border-b]:pb-4 border-b">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Basic account details and authentication status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <InfoRow icon={Mail} label="Email Address" value={user.email} />
              <InfoRow icon={UserCheck} label="Role" value={getRoleLabel(user.role)} />
              <InfoRow
                icon={user.isEmailConfirmed ? CheckCircle : ShieldAlert}
                label="Email Status"
                value={user.isEmailConfirmed ? 'Verified' : 'Not Verified'}
                valueClassName={user.isEmailConfirmed ? 'text-green-600' : 'text-red-600'}
              />
              <InfoRow
                icon={user.isBlocked ? Ban : CheckCircle}
                label="Account Status"
                value={user.isBlocked ? 'Blocked' : 'Active'}
                valueClassName={user.isBlocked ? 'text-red-600' : 'text-green-600'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Business details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            {user.companyInfo ? (
              <div className="space-y-2">
                <InfoRow icon={Building2} label="Company Name" value={user.companyInfo.name} />
                <InfoRow icon={Building2} label="DBA" value={user.companyInfo.dba} />
                <InfoRow icon={Mail} label="Company Email" value={user.companyInfo.email} />
                <InfoRow icon={Phone} label="Phone" value={user.companyInfo.phone} />
                <InfoRow icon={Phone} label="Fax" value={user.companyInfo.fax} />
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={
                    user.companyInfo.address
                      ? `${user.companyInfo.address}, ${user.companyInfo.city}, ${user.companyInfo.state} ${user.companyInfo.zip}`
                      : null
                  }
                />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No company information available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Carrier Numbers & Documentation
            </CardTitle>
            <CardDescription>Carrier identification numbers and uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            {user.carrierNumbers ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.carrierNumbers.mcNumber && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">MC Number</p>
                      <p className="text-lg font-semibold mt-1">{user.carrierNumbers.mcNumber}</p>
                    </div>
                  )}
                  {user.carrierNumbers.dotNumber && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">DOT Number</p>
                      <p className="text-lg font-semibold mt-1">{user.carrierNumbers.dotNumber}</p>
                    </div>
                  )}
                  {user.carrierNumbers.einNumber && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">EIN Number</p>
                      <p className="text-lg font-semibold mt-1">{user.carrierNumbers.einNumber}</p>
                    </div>
                  )}
                  {user.carrierNumbers.iftaNumber && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">IFTA Number</p>
                      <p className="text-lg font-semibold mt-1">{user.carrierNumbers.iftaNumber}</p>
                    </div>
                  )}
                  {user.carrierNumbers.orNumber && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">OR Number</p>
                      <p className="text-lg font-semibold mt-1">{user.carrierNumbers.orNumber}</p>
                    </div>
                  )}
                  {user.carrierNumbers.kyuNumber && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">KYU Number</p>
                      <p className="text-lg font-semibold mt-1">{user.carrierNumbers.kyuNumber}</p>
                    </div>
                  )}
                  {user.carrierNumbers.txNumber && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">TX Number</p>
                      <p className="text-lg font-semibold mt-1">{user.carrierNumbers.txNumber}</p>
                    </div>
                  )}
                  {user.carrierNumbers.tnNumber && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">TN Number</p>
                      <p className="text-lg font-semibold mt-1">{user.carrierNumbers.tnNumber}</p>
                    </div>
                  )}
                  {user.carrierNumbers.laNumber && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">LA Number</p>
                      <p className="text-lg font-semibold mt-1">{user.carrierNumbers.laNumber}</p>
                    </div>
                  )}
                </div>

                {user.carrierNumbers.notes && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm">{user.carrierNumbers.notes}</p>
                  </div>
                )}

                {user.carrierNumbers.files && user.carrierNumbers.files.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Uploaded Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.carrierNumbers.files.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                          <FileText className="h-8 w-8 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.originalname}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB • {file.contentType}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Hash className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No carrier information available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
