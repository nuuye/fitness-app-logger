import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import styles from "./sideBar.module.scss";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { deleteCategoryRequest } from "../../services/category";
import { categoryType } from "../../types";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Button, IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import { logoutRequest } from "../../services/user";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { BiLogOut } from "react-icons/bi";
import Category from "../Category/category";
import { createCategoryRequest, retrieveCategoriesRequest } from "../../services/category";
import { useUser } from "../../context/userContext";

interface sideBarProps {
    retrieveSubCategory: (subCategoryId: string) => void;
    retrieveSideBarStatus: (open: boolean) => void;
    retrieveShowMenuStatus: (open: boolean) => void;
    onClickDelete: (categoryId: string, label: string) => void;
    onChangeSubCategoryLabel?: (label: string) => void;
}

export interface SideBarRef {
    handleCategoryDelete: (id: string) => void;
}

const SideBar = forwardRef<SideBarRef, sideBarProps>(
    (
        { retrieveSubCategory, retrieveSideBarStatus, onClickDelete, onChangeSubCategoryLabel, retrieveShowMenuStatus },
        ref
    ) => {
        const router = useRouter();
        const { user, userInitials } = useUser();
        const [sideBarOpen, setSideBarOpen] = useState<boolean | null>(null);
        const [showMenu, setShowMenu] = useState<boolean>(false);
        const [mobileSideBar, setMobileSideBar] = useState<boolean>(false);
        const [categories, setCategories] = useState<categoryType[]>(null);

        useImperativeHandle(ref, () => ({
            handleCategoryDelete,
        }));

        //retrieving the user and its categories on page loading
        useEffect(() => {
            setSideBarOpen(localStorage.getItem("sideBarOpen") === "true");
            const redirectLogin = () => {
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
                localStorage.removeItem("subCategoryId");
                localStorage.removeItem("subCategory");
                router.push("/signin");
            };

            const fetchUserAndCategories = async () => {
                if (user === undefined) return;
                if (user) {
                    console.log("user found", user);
                    retrieveCategories(user.userId);
                } else {
                    redirectLogin();
                }
            };

            fetchUserAndCategories();
        }, [router, user]);

        //closing sideBar at 575 (goes at top)
        useEffect(() => {
            const handleResize = () => {
                const screenWidth = window.innerWidth;
                if (screenWidth <= 575) {
                    setMobileSideBar(true);
                    setSideBarOpen(false);
                    retrieveSideBarStatus(false);
                } else {
                    setMobileSideBar(false);
                    setShowMenu(false);
                    retrieveShowMenuStatus(true);
                }
            };

            handleResize();

            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }, [retrieveShowMenuStatus, retrieveSideBarStatus]);

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
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
                localStorage.removeItem("subCategoryId");
                localStorage.removeItem("subCategory");
                router.push("/");
            }
        };

        const handleShowMenu = () => {
            setShowMenu(!showMenu);
            retrieveShowMenuStatus(showMenu);
        };

        if (sideBarOpen === null) return null;

        return (
            <div
                className={`${styles.rootSideBarOpen} ${!sideBarOpen && styles.rootSideBarClosed} ${
                    showMenu && styles.menuExtanded
                }`}
            >
                <div className={styles.mainContainer}>
                    <div
                        className={`${styles.header} ${!sideBarOpen && styles.headerClosed} ${
                            mobileSideBar && styles.headerMenu
                        }`}
                    >
                        <div className={styles.profileSection} onClick={() => router.push("/settings")}>
                            <Avatar sx={{ width: 38, height: 38 }}>{userInitials}</Avatar>
                            {sideBarOpen && <span>{user ? user.name : ""}</span>}
                        </div>

                        {!mobileSideBar ? (
                            sideBarOpen ? (
                                <GoSidebarExpand
                                    className={styles.wrapIcon}
                                    onClick={() => {
                                        setSideBarOpen(false);
                                        localStorage.setItem("sideBarOpen", "false");
                                        retrieveSideBarStatus(false);
                                    }}
                                />
                            ) : (
                                <GoSidebarCollapse
                                    className={`${styles.wrapIcon} ${styles.wrapIconClosed}`}
                                    onClick={() => {
                                        setSideBarOpen(true);
                                        localStorage.setItem("sideBarOpen", "true");
                                        retrieveSideBarStatus(true);
                                    }}
                                />
                            )
                        ) : (
                            <IconButton onClick={handleShowMenu} className={styles.menuButton}>
                                <MenuIcon />
                            </IconButton>
                        )}
                    </div>
                    <div className={styles.body}>
                        <List
                            className={`${styles.homeContainer} ${!sideBarOpen && styles.homeContainerHidden} ${
                                showMenu && styles.homeContainerMenu
                            }`}
                        >
                            <ListItemButton onClick={() => router.push("/home")}>
                                <ListItemIcon>
                                    <HomeIcon className={styles.homeIcon} />
                                </ListItemIcon>
                                <ListItemText primary="Analytics" />
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
                                        onChangeSubCategoryLabel={onChangeSubCategoryLabel}
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
                            {mobileSideBar && (
                                <ListItemButton onClick={() => router.push("/settings")}>
                                    <ListItemIcon>
                                        <SettingsOutlinedIcon className={styles.homeIcon} />
                                    </ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </ListItemButton>
                            )}
                        </List>
                    </div>

                    <div className={`${styles.footer} ${!sideBarOpen && styles.wrappedFooter}`}>
                        <div className={`${styles.footerButton} ${sideBarOpen && styles.removeFooterButton}`}>
                            <Button
                                className={`${styles.homeButton} ${
                                    sideBarOpen ? styles.wrappedHomeButtonHidden : styles.wrappedHomeButton
                                }`}
                                variant="outlined"
                                startIcon={<HomeIcon />}
                                onClick={() => router.push("/home")}
                            ></Button>
                        </div>
                        <div className={styles.footerButton}>
                            <Button
                                className={`${styles.settingsButton} ${!sideBarOpen && styles.wrappedSettingsButton}`}
                                variant="outlined"
                                startIcon={<SettingsOutlinedIcon />}
                                onClick={() => router.push("/settings")}
                            >
                                {sideBarOpen ? "Settings" : ""}
                            </Button>
                        </div>
                        <div className={styles.footerButton}>
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
                </div>
            </div>
        );
    }
);
export default SideBar;
