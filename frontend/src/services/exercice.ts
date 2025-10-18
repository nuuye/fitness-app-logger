import { ExerciceType, PerformanceType } from "../types/exercice";

const API_EXERCICE_URL = process.env.EXERCICE_API_URL;

export const createExerciceRequest = async (
    name: string,
    initialPerformance: PerformanceType,
    userId: string,
    subCategory: string
): Promise<ExerciceType> => {
    try {
        // S'assurer que les valeurs numériques sont bien des nombres
        const sanitizedPerformance = {
            ...initialPerformance,
            sets: initialPerformance.sets.map((set) => ({
                kg: Number(set.kg) || 0,
                reps: Number(set.reps) || 0,
            })),
        };

        const response = await fetch(`${API_EXERCICE_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                performances: [sanitizedPerformance],
                userId,
                subCategory,
            }),
        });

        if (!response.ok) {
            console.error("Failed to create exercise:", await response.text());
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
            return null;
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

export const getAllUserExerciceRequest = async (userId: string): Promise<ExerciceType[] | null> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return null;
        }

        const response = await fetch(`${API_EXERCICE_URL}/getAll/${userId}`, {
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

export const deleteExerciceRequest = async (exerciceId: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return false;
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

export const editExerciceRequest = async (
    exerciceId: string,
    label?: string,
    perfomances?: PerformanceType[]
): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return false;
        }

        const body: Record<string, any> = {};
        if (label !== undefined) body.name = label;
        if (perfomances !== undefined) body.performances = perfomances;

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
