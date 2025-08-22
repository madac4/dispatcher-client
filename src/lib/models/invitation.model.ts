export interface Invitation {
	_id: string
	code: string
	email: string
	role: 'admin' | 'user'
	invitedBy: string
	expiresAt: string
	used: boolean
	teamId: string
	createdAt: string
}

export interface TeamMember {
	_id: string
	email: string
	role: 'admin' | 'user'
	createdAt: string
}

export interface TeamMembersResponse {
	message: string
	members: TeamMember[]
}

export interface InvitationsResponse {
	message: string
	invitations: Invitation[]
}
