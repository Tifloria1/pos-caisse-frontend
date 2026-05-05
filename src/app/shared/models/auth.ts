export interface LoginRequest {
    email : string;
    password : string;
}

export interface RegisterRequest {
    name : string;
    email : string;
    password : string;
    role?: 'ADMIN' | 'CAISSIER';
}

export interface AuthResponse {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'CAISSIER';
    message: string;
    token: string;
}