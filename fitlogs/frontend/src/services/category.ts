const API_CATEGORY_URL: string = "http://localhost:8000/api/category";

export const createCategoryRequest = async (label: string) => {
    const response = await fetch(`${API_CATEGORY_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({label}),
    });
    
};
