import { User, UserCredentials, AuthResponse, SignupFormValues } from "../types";
const API_USER_URL = process.env.NEXT_PUBLIC_API_USER_URL;

export const signupRequest = async (data: SignupFormValues): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_USER_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.log("error creating an account: ", error);
        return null;
    }
};

export const loginRequest = async (credentials: UserCredentials): Promise<AuthResponse> => {
    console.log("process.env.API_USER_URL: ", API_USER_URL);
    try {
        const response = await fetch(`${API_USER_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(credentials),
        });

        if (!response) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.log("incorrect credentials", error);
        return null;
    }
};

export const emailCheckRequest = async (email: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_USER_URL}/checkUser`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (response.status === 204) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

export const getUserRequest = async (userId: string): Promise<User> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return;
        }
        const response = await fetch(`${API_USER_URL}/getUser/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to fetch user");
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

// services/user.ts
export const verifyTokenRequest = async (): Promise<boolean> => {
    console.log("verifyTokenRequest process.env.API_USER_URL: ", API_USER_URL);

    try {
        const response = await fetch(`${API_USER_URL}/verifyToken`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        console.log("Verify token response status:", response.status);
        if (!response.ok) return false;

        const data = await response.json();
        console.log("Verify token response data:", data);
        return data.login;
    } catch (error) {
        console.error("Error verifying token:", error);
        return false;
    }
};

export const logoutRequest = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_USER_URL}/logout`, {
            method: "POST",
            credentials: "include",
        });
        if (!response) {
            return false;
        }
        return true;
    } catch (error) {
        console.log("Logout error:", error);
    }
};
