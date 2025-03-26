import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import List from "@mui/material/List";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import styles from "./category.module.scss";
import { useEffect, useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import { subCategoryType } from "../../types/subCategory";
import SubCategory from "../subCategory/subCategory";
import {
    createSubCategoryRequest,
    deleteSubCategoryRequest,
    retrieveSubCategoriesRequest,
} from "../../services/subCategory";
import { User } from "../../types/user";

interface categoryProps {
    user: User;
    categoryId: string;
    retrieveSubCategory: (subCategoryId: string) => void;
}

export default function Category({ user, categoryId, retrieveSubCategory }: categoryProps) {
    const [categoryListOpen, setCategoryListOpen] = useState<boolean>(true);
    const [subCategories, setSubCategories] = useState<subCategoryType[]>(null);

    //retrieve subCategories
    useEffect(() => {
        const retrieveSubCategories = async () => {
            const result = await retrieveSubCategoriesRequest(categoryId);
            result && setSubCategories(result);
        };

        retrieveSubCategories();
    }, [categoryId]);

    //async function to create a sub category, adding it then to the list of categories
    const handleCreateSubCategory = async () => {
        const newSubCategory = await createSubCategoryRequest("default sub-category", user.userId, categoryId);
        console.log("newSubCategory:", newSubCategory);
        if (newSubCategory) {
            setSubCategories((prevSubCategories) =>
                prevSubCategories ? [...prevSubCategories, newSubCategory] : [newSubCategory]
            );
        }
    };

    //async function to delete a category based on its id
    const subCategoryDeleteHandler = async (id: string) => {
        const success = await deleteSubCategoryRequest(id);
        if (success) {
            setSubCategories((prevSubCategories) => prevSubCategories.filter((category) => category._id !== id));
        }
    };

    return (
        <List component="nav" className={styles.sessionContainer}>
            <ListItemButton onClick={() => setCategoryListOpen(!categoryListOpen)}>
                <ListItemIcon>
                    <ArticleIcon className={styles.categoriesIcon} />
                </ListItemIcon>
                <ListItemText primary="Default Category" />
                {categoryListOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={categoryListOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {subCategories &&
                        subCategories.map((subCategory) => (
                            <div onClick={() => retrieveSubCategory(subCategory._id)} key={subCategory._id}>
                                <SubCategory
                                    id={subCategory._id}
                                    label={subCategory.name}
                                    key={subCategory._id}
                                    onClickDelete={() => subCategoryDeleteHandler(subCategory._id)}
                                />
                            </div>
                        ))}
                    <ListItemButton sx={{ pl: 2 }} onClick={() => handleCreateSubCategory()}>
                        <ListItemIcon>
                            <AddCircleOutlineIcon className={styles.addIconButton} fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Add sub-category" />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
}
