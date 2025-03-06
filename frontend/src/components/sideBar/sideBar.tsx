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
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { User } from "../../types/user";

interface sideBarProps {
    retrieveCategory: (category: string) => void;
}

export default function SideBar({ retrieveCategory }: sideBarProps) {
    const router = useRouter();
    const [user, setUser] = useState<User>(null);
    const [categoryListOpen, setCategoryListOpen] = useState<boolean>(true);
    const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
    const [categories, setCategories] = useState<categoryType[]>(null);

    //retrieving the user and its categories on page loading
    useEffect(() => {
        const fetchUserAndCategories = async () => {
            const storageUserId = localStorage.getItem("userId");
            if (storageUserId) {
                const user = await retrieveCurrentUser(storageUserId);
                if (user) {
                    setUser(user);
                    retrieveCategories(user.userId);
                } else {
                    router.push("/signin");
                }
            }
        };

        fetchUserAndCategories();
    }, [router]);

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

    //function retrieving initals of a provided name (full name or only firstName)
    const getUserNameInitials = (name: string): string => {
        let splittedName: string[] = name.split(" ");
        return splittedName.length > 1
            ? splittedName[0].charAt(0) + splittedName[1].charAt(0)
            : splittedName[0].charAt(0);
    };

    return (
        <div className={`${styles.rootSideBarOpen} ${!sideBarOpen && styles.rootSideBarClosed}`}>
            <div className={`${styles.header} ${!sideBarOpen && styles.headerClosed}`}>
                <Avatar sx={{ width: 38, height: 38 }}>{user ? getUserNameInitials(user.name) : "..."}</Avatar>
                {sideBarOpen && <span>{user ? user.name : ""}</span>}
                {sideBarOpen ? (
                    <GoSidebarExpand className={styles.wrapIcon} onClick={() => setSideBarOpen(!sideBarOpen)} />
                ) : (
                    <GoSidebarCollapse
                        className={`${styles.wrapIcon} ${!sideBarOpen && styles.wrapIconClosed}`}
                        onClick={() => setSideBarOpen(!sideBarOpen)}
                    />
                )}
            </div>

            <div className={styles.body}>
                <List sx={{ display: sideBarOpen ? "block" : "none" }} className={styles.homeContainer}>
                    <ListItemButton>
                        <ListItemIcon>
                            <HomeIcon className={styles.homeIcon} />
                        </ListItemIcon>
                        <ListItemText primary="Home page" />
                    </ListItemButton>
                </List>

                <List
                    sx={{ display: sideBarOpen ? "block" : "none" }}
                    component="nav"
                    className={styles.sessionContainer}
                >
                    <ListItemButton onClick={() => setCategoryListOpen(!categoryListOpen)}>
                        <ListItemIcon>
                            <ArticleIcon className={styles.categoriesIcon} />
                        </ListItemIcon>
                        <ListItemText primary="Categories" />
                        {categoryListOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={categoryListOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {categories &&
                                categories.map((category, index) => (
                                    <div onClick={() => retrieveCategory(category.name)} key={index}>
                                        <Session
                                            id={category._id}
                                            label={category.name}
                                            key={index}
                                            onClickDelete={() => handleSessionDelete(category._id)}
                                        />
                                    </div>
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
            <div className={styles.footer}>
                <Button
                    className={`${styles.settingsButton} ${!sideBarOpen && styles.wrappedSettingsButton}`}
                    variant="outlined"
                    startIcon={<SettingsOutlinedIcon />}
                >
                    {sideBarOpen ? "Settings" : ""}
                </Button>
            </div>
        </div>
    );
}
