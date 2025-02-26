const API_USER_URL: string = "http://localhost:8000/api/auth";

interface User {
    email: string;
    password: string;
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

export const loginRequest = async (credentials: User): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_USER_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({credentials}),
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
            body: JSON.stringify({email}),
        });
        if(response.status === 204){
            return false;
        }
        return true;
    } catch {
        return false;
    }
};
