export enum ActivityType {
	ORDER_CREATED = 'order_created',
	ORDER_UPDATED = 'order_updated',
	USER_JOINED = 'user_joined',
	NEW_MESSAGE = 'new_message',
	FILE_UPLOADED = 'file_uploaded',
}

export type DashboardCard = {
	title: string
	value: number
	description: string
}
