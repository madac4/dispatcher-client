'use client';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/elements/pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRole } from '@/lib/models/auth.model';
import { PaginationMeta, RequestModel } from '@/lib/models/response.model';
import { UserWithSettings } from '@/lib/models/user.model';
import { UserService } from '@/lib/services/userService';
import { Mail, Phone, Search, UserCheck, Users, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';

const getRoleColor = (role: UserRole) => {
  switch (role) {
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

const getInitials = (email: string) => {
  const parts = email.split('@')[0].split('.');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return email.substring(0, 2).toUpperCase();
};

interface UsersListProps {
  role?: UserRole;
  title?: string;
}

export function UsersList({ role, title }: UsersListProps) {
  const [payload, setPayload] = useState<RequestModel>(new RequestModel({ page: 1, limit: 6 }));

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [users, setUsers] = useState<UserWithSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 6,
  });

  const handleUserClick = useCallback(
    (userId: string) => {
      router.push(`/dashboard/users/${userId}`);
    },
    [router],
  );

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPayload(new RequestModel({ page: 1, limit: payload.limit, search: searchTerm }));
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, payload.limit]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      if (role) payload.role = role;

      if (debouncedSearchTerm) payload.search = debouncedSearchTerm;

      const response = await UserService.getAllUsersWithSettings(payload);
      if (response.success && response.data) {
        setUsers(response.data.users || []);
        if (response.meta) {
          setPagination({
            totalItems: response.meta.totalItems,
            totalPages: response.meta.totalPages,
            currentPage: response.meta.currentPage,
            itemsPerPage: response.meta.itemsPerPage,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [payload, role, debouncedSearchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePaginationChange = useCallback(
    (pageSize: number, page: number) => {
      setPayload(new RequestModel({ page, limit: pageSize, search: debouncedSearchTerm }));
    },
    [debouncedSearchTerm],
  );

  return (
    <Card className="py-4 gap-4">
      <CardHeader className="flex items-center justify-between border-b px-4 [.border-b]:pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title} {role && `(${pagination.totalItems})`}
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={`Search ${
              role === UserRole.USER ? 'users' : role === UserRole.MODERATOR ? 'moderators' : 'users'
            }...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title={`No ${
              role === UserRole.USER ? 'users' : role === UserRole.MODERATOR ? 'moderators' : 'users'
            } found`}
            description={
              searchTerm
                ? `No ${
                    role === UserRole.USER ? 'users' : role === UserRole.MODERATOR ? 'moderators' : 'users'
                  } match your search criteria.`
                : role === UserRole.USER
                ? 'No users found in the system.'
                : role === UserRole.MODERATOR
                ? 'No moderators found in the system.'
                : 'No users or moderators found.'
            }
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {users.map((user) => {
                const displayName = user.companyInfo?.name || user.email.split('@')[0];
                const displayEmail = user.companyInfo?.email || user.email;
                const displayPhone = user.companyInfo?.phone;

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                      {getInitials(user.email)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{displayName}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getRoleColor(user.role)}`}>{getRoleLabel(user.role)}</Badge>
                          <Badge className={`text-xs ${getStatusColor(user.isEmailConfirmed)} flex items-center gap-1`}>
                            {getStatusIcon(user.isEmailConfirmed)}
                            {getStatusLabel(user.isEmailConfirmed)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail className="h-3 w-3" />
                          {displayEmail}
                        </div>
                        {displayPhone && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />
                            {displayPhone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {pagination.totalPages > payload?.page && (
              <Pagination
                itemsPerPage={payload.limit}
                currentPage={payload.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                hidePageSizeSelector={true}
                itemsLength={users.length}
                onPaginationChange={handlePaginationChange}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
