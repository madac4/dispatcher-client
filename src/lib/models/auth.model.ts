export type LoginResponse = {
	accessToken: string
	refreshToken: string
}

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
}
