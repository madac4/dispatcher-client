'use client';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/elements/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRole } from '@/lib/models/auth.model';
import { RequestModel } from '@/lib/models/response.model';
import { UserWithSettings } from '@/lib/models/user.model';
import { UserService } from '@/lib/services/userService';
import { Mail, MoreHorizontal, Phone, Search, UserCheck, Users, UserX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.substring(0, 2).toUpperCase();
};

interface UserListSectionProps {
  users: UserWithSettings[];
  searchTerm: string;
  title: string;
}

function UserListSection({ users, searchTerm, title }: UserListSectionProps) {
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoleLabel(user.role).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (filteredUsers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {filteredUsers.map((user) => {
        const displayName = user.companyInfo?.name || user.email.split('@')[0];
        const displayEmail = user.companyInfo?.email || user.email;
        const displayPhone = user.companyInfo?.phone;

        return (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
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
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

interface UsersListProps {
  roleFilter?: 'users' | 'moderators' | 'all';
  title?: string;
}

export function UsersList({ roleFilter = 'all', title }: UsersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserWithSettings[]>([]);
  const [moderators, setModerators] = useState<UserWithSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 5,
  });
  const [payload, setPayload] = useState<RequestModel>(new RequestModel({ page: 1, limit: 5 }));
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const requestPayload = new RequestModel({ page: payload.page, limit: itemsPerPage });

      // Add role filter if specified
      if (roleFilter === 'users') {
        requestPayload.role = UserRole.USER;
      } else if (roleFilter === 'moderators') {
        requestPayload.role = UserRole.MODERATOR;
      }

      // Add search term
      if (searchTerm) {
        requestPayload.search = searchTerm;
      }

      const response = await UserService.getAllUsersWithSettings(requestPayload);
      if (response.success && response.data) {
        setUsers(response.data.users || []);
        setModerators(response.data.moderators || []);
        if (response.meta) {
          setPagination({
            totalItems: response.meta.totalItems,
            totalPages: response.meta.totalPages,
            currentPage: response.meta.currentPage,
            itemsPerPage: response.meta.itemsPerPage,
          });
        }
      }
    } catch (error: unknown) {
      console.error('Failed to fetch users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [payload.page, payload.limit, roleFilter, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search with debounce
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        setPayload(new RequestModel({ page: 1, limit: itemsPerPage }));
      }, 300);
    },
    [itemsPerPage],
  );

  // Reset to page 1 when role filter changes
  useEffect(() => {
    setPayload(new RequestModel({ page: 1, limit: itemsPerPage }));
  }, [roleFilter, itemsPerPage]);

  const handlePaginationChange = useCallback((pageSize: number, page: number) => {
    setItemsPerPage(pageSize);
    setPayload(new RequestModel({ page, limit: pageSize }));
  }, []);

  // Filter users based on roleFilter prop
  const displayUsers =
    roleFilter === 'users' ? users : roleFilter === 'moderators' ? moderators : [...users, ...moderators];
  const displayTitle =
    title || (roleFilter === 'users' ? 'Users' : roleFilter === 'moderators' ? 'Moderators' : 'Team Members');

  const filteredUsers = displayUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoleLabel(user.role).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {displayTitle} {roleFilter !== 'all' && `(${pagination.totalItems})`}
        </CardTitle>
        <CardDescription>
          {roleFilter === 'users'
            ? 'Manage regular users and their permissions'
            : roleFilter === 'moderators'
            ? 'Manage moderators and their permissions'
            : 'Manage your dispatch team and user permissions'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={`Search ${
              roleFilter === 'users' ? 'users' : roleFilter === 'moderators' ? 'moderators' : 'users'
            }...`}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

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
        ) : error ? (
          <EmptyState
            icon={Users}
            title="Error loading users"
            description={error}
            action={{
              label: 'Retry',
              onClick: fetchUsers,
            }}
          />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title={`No ${
              roleFilter === 'users' ? 'users' : roleFilter === 'moderators' ? 'moderators' : 'users'
            } found`}
            description={
              searchTerm
                ? `No ${
                    roleFilter === 'users' ? 'users' : roleFilter === 'moderators' ? 'moderators' : 'users'
                  } match your search criteria.`
                : roleFilter === 'users'
                ? 'No users found in the system.'
                : roleFilter === 'moderators'
                ? 'No moderators found in the system.'
                : 'No users or moderators found.'
            }
          />
        ) : roleFilter === 'all' ? (
          <div className="space-y-6">
            {users.length > 0 && (
              <UserListSection users={users} searchTerm={searchTerm} title={`Users (${users.length})`} />
            )}
            {moderators.length > 0 && (
              <UserListSection users={moderators} searchTerm={searchTerm} title={`Moderators (${moderators.length})`} />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {displayUsers.map((user) => {
                const displayName = user.companyInfo?.name || user.email.split('@')[0];
                const displayEmail = user.companyInfo?.email || user.email;
                const displayPhone = user.companyInfo?.phone;

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
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
                    {/* <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button> */}
                  </div>
                );
              })}
            </div>

            {pagination.totalItems > pagination.itemsPerPage && (
              <Pagination
                itemsPerPage={pagination.itemsPerPage}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                hidePageSizeSelector={true}
                itemsLength={displayUsers.length}
                onPaginationChange={handlePaginationChange}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
