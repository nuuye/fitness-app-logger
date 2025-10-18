import { User, UserCredentials, AuthResponse, SignupFormValues } from "../types";
const API_USER_URL = process.env.NEXT_PUBLIC_USER_API_URL;

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

export const googleAuthRequest = async (name: string, email: string) => {
    try {
        const response = await fetch(`${API_USER_URL}/google-auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
            console.error(`HTTP Error: ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("google authentification failed", error);
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

export const editUserRequest = async (
    userId: string,
    name?: string,
    email?: string
): Promise<{ success: boolean; user?: User }> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return { success: false };
        }

        const response = await fetch(`${API_USER_URL}/editUser/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ email, name }),
        });
        if (response.status !== 200) {
            return { success: false };
        }
        const data = await response.json();
        return { success: true, user: data.user };
    } catch (error) {
        console.error("Error editing user:", error);
        return { success: false };
    }
};

export const changePasswordRequest = async (
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return false;
        }
        const response = await fetch(`${API_USER_URL}/changePassword/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        if (response.status !== 200) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error changing password:", error);
        return false;
    }
};

export const getUserRequest = async (userId: string): Promise<User> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return null;
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

export const verifyTokenRequest = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_USER_URL}/verifyToken`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) return false;

        const data = await response.json();
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
