export interface LoginRequest {
    email : string;
    password : string;
}

export interface RegisterRequest {
    name : string;
    email : string;
    password : string;
    role?: string;
}

export interface AuthResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    message: string;
    token: string;
}