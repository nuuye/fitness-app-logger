import { categoryType } from "../types";
const API_CATEGORY_URL: string = "https://fitlogs-backend.vercel.app/api/category";

//API request to create a category
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

export const getCategoryRequest = async (categoryId: string): Promise<categoryType> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return;
        }
        const response = await fetch(`${API_CATEGORY_URL}/get/${categoryId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            return null;
        }
        const category = await response.json();
        return category;
    } catch (error) {
        console.log(error);
        return null;
    }
};

//API request to delete a specific category
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

export const retrieveCategoriesRequest = async (userId: string): Promise<categoryType[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return;
        }
        const response = await fetch(`${API_CATEGORY_URL}/getAll/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!response) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const editCategoryRequest = async (id: string, label: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return;
        }
        const response = await fetch(`${API_CATEGORY_URL}/edit/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: label }),
        });
        if (!response) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
