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

export interface AuthResponseWithStatus {
    status: 201 | 409 | 500; //success | conflict | error
    data: { userId: string; name: string; email: string; token: string } | null;
};

export interface SignupFormValues {
    name: string;
    email: string;
    password: string;
}
