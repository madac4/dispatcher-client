import { apiRequest } from '@/middleware/errorHandler'
import api from '../api'

const baseURL = '/invitation'

export const InvitationService = {
	async invite(email: string) {
		return apiRequest<null>(() =>
			api.post(`${baseURL}/invite`, { email }).then(res => res.data),
		)
	},

	async getInvitations() {
		const response = await fetch('/api/invitations', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || 'Failed to fetch invitations')
		}

		return response.json()
	},

	async removeInvitation(inviteId: string) {
		const response = await fetch(`/api/invitations/${inviteId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || 'Failed to remove invitation')
		}

		return response.json()
	},

	async getTeamMembers() {
		const response = await fetch('/api/team/members', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || 'Failed to fetch team members')
		}

		return response.json()
	},
}
