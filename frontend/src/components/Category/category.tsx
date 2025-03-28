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
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

interface categoryProps {
    user: User;
    categoryId: string;
    retrieveSubCategory: (subCategoryId: string) => void;
    onClickDelete: (categoryId: string) => void;
}

export default function Category({ user, categoryId, retrieveSubCategory, onClickDelete }: categoryProps) {
    const [categoryListOpen, setCategoryListOpen] = useState<boolean>(false);
    const [subCategories, setSubCategories] = useState<subCategoryType[]>(null);
    const [showMore, setShowMore] = useState<boolean>(false);

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

    const handleShowInput = () => {
        console.log("modifying");
    };

    return (
        <List component="nav" className={styles.categoryContainer}>
            <ListItemButton
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={() => setShowMore(false)}
                onClick={() => setCategoryListOpen(!categoryListOpen)}
            >
                <ListItemIcon>
                    <ArticleIcon className={styles.categoriesIcon} />
                </ListItemIcon>
                <ListItemText primary="Default Category" />
                {showMore && (
                    <ListItemIcon className={styles.iconContainer}>
                        <BorderColorIcon
                            onClick={(event) => {
                                event.stopPropagation();
                                handleShowInput();
                            }}
                            className={styles.editIcon}
                            fontSize="small"
                        />
                        <DeleteIcon
                            onClick={(event) => {
                                event.stopPropagation();
                                onClickDelete(categoryId);
                            }}
                            className={styles.deleteIcon}
                            fontSize="small"
                        />
                    </ListItemIcon>
                )}
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
