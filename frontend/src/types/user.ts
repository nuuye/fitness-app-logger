export interface User {
    userId: string;
    name: string;
    email: string;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: string;
    name: string;
    email: string;
    token: string;
}

export interface SignupFormValues {
    name: string;
    email: string;
    password: string;
}