const API_EXERCICE_URL: string = "http://localhost:8000/api/exercice";

interface SetType {
    reps: number;
    kg: number;
}
interface ExerciceType {
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
