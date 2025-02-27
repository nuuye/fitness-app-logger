import { categoryType } from "../types";
const API_CATEGORY_URL: string = "http://localhost:8000/api/category";

export const createCategoryRequest = async (label: string): Promise<categoryType> => {
    try {
        const response = await fetch(`${API_CATEGORY_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name: label}),
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
