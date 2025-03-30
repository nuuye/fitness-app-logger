import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import styles from "./sideBar.module.scss";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { deleteCategoryRequest } from "../../services/category";
import { categoryType } from "../../types";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { getUserRequest, logoutRequest } from "../../services/user";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { User } from "../../types/user";
import { BiLogOut } from "react-icons/bi";
import Category from "../Category/category";
import { createCategoryRequest, retrieveCategoriesRequest } from "../../services/category";

interface sideBarProps {
    retrieveSubCategory: (category: string) => void;
    retrieveSideBarStatus: (open: boolean) => void;
    onClickDelete: (categoryId: string, label: string) => void;
}

export interface SideBarRef {
    handleCategoryDelete: (id: string) => void;
}

//export default function SideBar({ retrieveSubCategory, retrieveSideBarStatus, onClickDelete }: sideBarProps) {
const SideBar = forwardRef<SideBarRef, sideBarProps>(
    ({ retrieveSubCategory, retrieveSideBarStatus, onClickDelete }, ref) => {
        const router = useRouter();
        const [user, setUser] = useState<User>(null);
        const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
        const [categories, setCategories] = useState<categoryType[]>(null);

        useImperativeHandle(ref, () => ({
            handleCategoryDelete,
        }));

        //retrieving the user and its categories on page loading
        useEffect(() => {
            const redirectLogin = () => {
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
                router.push("/signin");
            };

            const fetchUserAndCategories = async () => {
                const storageUserId = localStorage.getItem("userId");
                if (storageUserId) {
                    const user = await retrieveCurrentUser(storageUserId);
                    if (user) {
                        setUser(user);
                        console.log("user found", user);
                        retrieveCategories(user.userId);
                    } else {
                        redirectLogin();
                    }
                } else {
                    redirectLogin();
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
        const handleCreateCategory = async () => {
            const newCategory = await createCategoryRequest("default category", user.userId);
            console.log("new category:", newCategory);
            if (newCategory) {
                setCategories((prevCategories) => (prevCategories ? [...prevCategories, newCategory] : [newCategory]));
            }
        };

        //async function to delete a category based on its id
        const handleCategoryDelete = async (id: string) => {
            console.log("deleting");
            const success = await deleteCategoryRequest(id);
            if (success) {
                setCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
            }
        };

        const handleLogout = async (): Promise<void> => {
            const success = await logoutRequest();
            if (success) {
                console.log("success logout");
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
                router.push("/");
            }
        };

        //function retrieving initals of a provided name (full name or only firstName)
        const getUserNameInitials = (name: string): string => {
            let splittedName: string[] = name.trim().split(" ");
            return splittedName.length > 1
                ? splittedName[0].charAt(0) + splittedName[1].charAt(0)
                : splittedName[0].charAt(0);
        };

        //memoizing user initials to avoid re calculation at every render
        const userInitials = useMemo(() => {
            return user && user.name ? getUserNameInitials(user.name).toUpperCase() : "...";
        }, [user]);

        return (
            <div className={`${styles.rootSideBarOpen} ${!sideBarOpen && styles.rootSideBarClosed}`}>
                <div className={`${styles.header} ${!sideBarOpen && styles.headerClosed}`}>
                    <Avatar sx={{ width: 38, height: 38 }}>{userInitials}</Avatar>
                    {sideBarOpen && <span>{user ? user.name : ""}</span>}
                    {sideBarOpen ? (
                        <GoSidebarExpand
                            className={styles.wrapIcon}
                            onClick={() => {
                                setSideBarOpen(!sideBarOpen);
                                retrieveSideBarStatus(false);
                            }}
                        />
                    ) : (
                        <GoSidebarCollapse
                            className={`${styles.wrapIcon} ${!sideBarOpen && styles.wrapIconClosed}`}
                            onClick={() => {
                                setSideBarOpen(!sideBarOpen);
                                retrieveSideBarStatus(true);
                            }}
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
                        {categories &&
                            categories.map((category) => (
                                <Category
                                    key={category._id}
                                    user={user}
                                    categoryId={category._id}
                                    retrieveSubCategory={retrieveSubCategory}
                                    onClickDelete={(categoryId) => {
                                        onClickDelete(categoryId, category.name);
                                    }}
                                    label={category.name}
                                />
                            ))}

                        <ListItemButton
                            className={styles.addCategoryContainer}
                            sx={{ pl: 1.5 }}
                            onClick={() => handleCreateCategory()}
                        >
                            <ListItemIcon>
                                <AddCircleOutlineIcon className={styles.addIconButton} fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Add new category" />
                        </ListItemButton>
                    </List>
                </div>

                <div className={`${styles.footer} ${!sideBarOpen && styles.wrappedFooter}`}>
                    <Button
                        className={`${styles.settingsButton} ${!sideBarOpen && styles.wrappedSettingsButton}`}
                        variant="outlined"
                        startIcon={<SettingsOutlinedIcon />}
                    >
                        {sideBarOpen ? "Settings" : ""}
                    </Button>
                    <Button
                        className={`${styles.logoutButton} ${!sideBarOpen && styles.wrappedLogoutButton}`}
                        variant="outlined"
                        startIcon={<BiLogOut />}
                        onClick={() => handleLogout()}
                    >
                        {sideBarOpen ? "Logout" : ""}
                    </Button>
                </div>
            </div>
        );
    }
);
export default SideBar;
