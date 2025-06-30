import { subCategoryType } from "./../types/subCategory";

const API_SUBCATEGORY_URL = process.env.NEXT_PUBLIC_API_SUBCATEGORY_URL;

//API request to create a sub category
export const createSubCategoryRequest = async (
    label: string,
    userId: string,
    categoryId: string
): Promise<subCategoryType> => {
    try {
        const response = await fetch(`${API_SUBCATEGORY_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: label, userId: userId, category: categoryId }),
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

export const getSubCategoryRequest = async (categoryId: string): Promise<subCategoryType> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return null;
        }
        const response = await fetch(`${API_SUBCATEGORY_URL}/get/${categoryId}`, {
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

//API request to delete a specific subCategory
export const deleteSubCategoryRequest = async (id: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return false;
        }
        const response = await fetch(`${API_SUBCATEGORY_URL}/delete/${id}`, {
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

export const retrieveSubCategoriesRequest = async (categoryId: string): Promise<subCategoryType[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return null;
        }
        const response = await fetch(`${API_SUBCATEGORY_URL}/retrieveAll/${categoryId}`, {
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

export const retrieveUserSubCategoriesRequest = async (userId: string): Promise<subCategoryType[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return null;
        }
        const response = await fetch(`${API_SUBCATEGORY_URL}/getAll/${userId}`, {
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

export const editSubCategoryRequest = async (id: string, label: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found in localStorage");
            return false;
        }
        const response = await fetch(`${API_SUBCATEGORY_URL}/edit/${id}`, {
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
