import { categoryType } from "../types";
const API_CATEGORY_URL: string = "http://localhost:8000/api/category";

export const createCategoryRequest = async (label: string, userId: string): Promise<categoryType> => {
    try {
        const response = await fetch(`${API_CATEGORY_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: label, userId: userId }),
        });
        if (!response) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.log("error creating category", error);
        return null;
    }
};

//API request to delete a specific task
export const deleteCategoryRequest = async (id: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return;
        }
        const response = await fetch(`${API_CATEGORY_URL}/delete/${id}`, {
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
