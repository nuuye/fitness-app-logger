import { useEffect, useState } from "react";
import styles from "./sideBar.module.scss";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ArticleIcon from "@mui/icons-material/Article";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Session from "../session/session";
import { createCategoryRequest, deleteCategoryRequest, retrieveCategoriesRequest } from "../../services/category";
import { categoryType } from "../../types";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { getUserRequest } from "../../services/user";

interface User {
    userId: string;
    name: string;
    email: string;
}

export default function SideBar() {
    const [user, setUser] = useState<User>(null);
    const [open, setOpen] = useState<boolean>(true);
    const [categories, setCategories] = useState<categoryType[]>(null);

    const handleClick = () => {
        setOpen(!open);
    };

    //retrieving the user and its categories on page loading
    useEffect(() => {
        const fetchUserAndCategories = async () => {
            const storageUserId = localStorage.getItem("userId");
            if (storageUserId) {
                const user = await retrieveCurrentUser(storageUserId);
                if (user) {
                    setUser(user);
                    retrieveCategories(user.userId);
                }
            }
        };

        fetchUserAndCategories();
    }, []);

    useEffect(() => {
        console.log(categories);
    }, [categories]);

    //async function to retrieve the logged user
    const retrieveCurrentUser = async (userId: string): Promise<User> => {
        const user = await getUserRequest(userId);
        return user ? user : null;
    };

    //async function to retrieve categories related to the current user
    const retrieveCategories = async (userId: string) => {
        const categoriesData = await retrieveCategoriesRequest(userId);
        if (categoriesData) {
            setCategories(categoriesData);
        }
    };

    //async function to create a category, adding it then to the list of categories
    const handleCreateSection = async () => {
        const newCategory = await createCategoryRequest("default category", user.userId);
        if (newCategory) {
            setCategories((prevCategories) => (prevCategories ? [...prevCategories, newCategory] : [newCategory]));
        }
        console.log(categories);
    };

    //async function to delete a category based on its id
    const handleSessionDelete = async (id: string) => {
        const success = await deleteCategoryRequest(id);
        if (success) {
            setCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
        }
    };

    return (
        <div className={styles.root}>
            <header>
                <Avatar>H</Avatar>
            </header>

            <div className={styles.body}>
                <List component="nav" aria-labelledby="nested-list-subheader" className={styles.sessionContainer}>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <ArticleIcon className={styles.categoriesIcon} />
                        </ListItemIcon>
                        <ListItemText primary="Categories" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {categories &&
                                categories.map((category, index) => (
                                    <Session
                                        id={category._id}
                                        label={category.name}
                                        key={index}
                                        onClickDelete={() => handleSessionDelete(category._id)}
                                    />
                                ))}
                            <ListItemButton sx={{ pl: 2 }} onClick={() => handleCreateSection()}>
                                <ListItemIcon>
                                    <AddCircleOutlineIcon className={styles.addIconButton} fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Add new category" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </div>
            <footer>
                <Button className={styles.settingsButton} variant="outlined" startIcon={<SettingsOutlinedIcon />}>
                    Settings
                </Button>
            </footer>
        </div>
    );
}
