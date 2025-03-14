const API_EXERCICE_URL: string = "http://localhost:8000/api/exercice";

interface SetType {
    reps: number;
    kg: number;
}
interface ExerciceType {
    _id: string;
    name: string;
    sets: SetType[];
    categoryId: string;
    userId: string;
    note?: string;
}

export const createExerciceRequest = async (
    name: string,
    sets: { kg: number; reps: number }[],
    userId: string,
    category: string,
    note?: string
): Promise<ExerciceType> => {
    try {
        const response = await fetch(`${API_EXERCICE_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, sets, userId, category, ...(note && { note }) }),
        });
        if (!response) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.log("error creating exercice", error);
        return null;
    }
};

export const getAllExerciceRequest = async (userId: string, subCategoryId: string): Promise<ExerciceType[] | null> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return;
        }

        const response = await fetch(`${API_EXERCICE_URL}/getAll/${userId}/${subCategoryId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.log("error retrieving exercices", error);
        return null;
    }
};

export const deleteExerciceRequest = async (exerciceId: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return;
        }
        const response = await fetch(`${API_EXERCICE_URL}/delete/${exerciceId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const editExerciceRequest = async (exerciceId: string, label?: string, sets?: SetType[]): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return false;
        }

        const body: Record<string, any> = {};
        if (label !== undefined) body.name = label;
        if (sets !== undefined) body.sets = sets;

        const response = await fetch(`${API_EXERCICE_URL}/edit/${exerciceId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error("Edit exercice failed:", await response.json());
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error editing exercice:", error);
        return false;
    }
};
