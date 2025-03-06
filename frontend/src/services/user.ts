const API_USER_URL: string = "http://localhost:8000/api/auth";

interface UserCredentials {
    email: string;
    password: string;
}

interface User {
    userId: string;
    name: string;
    email: string;
}

interface AuthResponse {
    userId: string;
    token: string;
}

interface SignupFormValues {
    name: string;
    email: string;
    password: string;
}

export const signupRequest = async (data: SignupFormValues): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_USER_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
