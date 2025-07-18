export interface SetType {
    reps: number | string;
    kg: number | string;
}

export interface PerformanceType {
    date: string; // Format ISO
    sets: SetType[];
    note?: string;
}

export interface ExerciceType {
    _id: string;
    name: string;
    performances: PerformanceType[];
    subCategory: string;
    userId: string;
    isEditing?: boolean;
}

interface ExerciceTableProps {
    subCategoryId: string;
    selectedDate?: string;
}