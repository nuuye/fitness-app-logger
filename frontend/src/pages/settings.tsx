import styles from "./settings.module.scss";
import AuthWrapper from "../components/authWrapper/authWrapper";
import DeleteCategoryWindow from "../components/deleteCategoryWindow/deleteCategoryWindow";
import SideBar, { SideBarRef } from "../components/sideBar/sideBar";
import { useEffect, useRef, useState } from "react";
import { getSubCategoryRequest } from "../services/subCategory";
import { useRouter } from "next/router";
import { Badge, Button } from "@mui/material";
import { BiLogOut } from "react-icons/bi";
import { logoutRequest } from "../services/user";
import { useUser } from "../context/userContext";
import Avatar from "@mui/material/Avatar";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Input from "@mui/material/Input";
import { editUserRequest } from "../services/user";
import ChangePasswordWindow from "../components/changePasswordWindow/changePasswordWindow";
import { signOut } from "next-auth/react";

export default function Settings() {
    const router = useRouter();
    const sideBarRef = useRef<SideBarRef>(null);

    const { user, userInitials, setUser } = useUser();

    const [sideBarOpen, setSideBarOpen] = useState<boolean | null>(null);
    const [hideMenu, setHideMenu] = useState<boolean>(true);

    const [showChangePasswordWindow, setShowChangePasswordWindow] = useState<boolean>(false);
    const [showDeleteCategoryWindow, setShowDeleteCategoryWindow] = useState<boolean>(false);
    const [tempCategory, setTempCategory] = useState<{ id: string; label: string }>(null);

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [canSave, setCanSave] = useState<boolean>(false);

    //retrieving user whenever its available
    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setEmail(user.email ?? "");
        }
    }, [user]);

    //retrieving sideBar status at reload
    useEffect(() => {
        setSideBarOpen(localStorage.getItem("sideBarOpen") === "true");
    }, []);

    //useEffect to monitor changes and make save button available or not
    useEffect(() => {
        if (!user) return;

        const isNameChanged = name !== user.name;
        const isEmailChanged = email !== user.email;

        setCanSave(isNameChanged || isEmailChanged);
    }, [name, email, user]);

    const triggerDeleteCategory = (id: string) => {
        sideBarRef.current?.handleCategoryDelete(id);
    };

    //handles the display of sub categories on dashboard whenever click
    const handleSubCategory = async (categoryId: string) => {
        localStorage.setItem("subCategoryId", categoryId);
        const retrieveSubCategory = await getSubCategoryRequest(categoryId);
        if (retrieveSubCategory) {
            localStorage.setItem("subCategory", retrieveSubCategory.name);
            router.push("/dashboard");
        }
    };

    const handleCancelWindow = () => {
        setShowDeleteCategoryWindow(!showDeleteCategoryWindow);
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await logoutRequest();
        } catch (e) {
            console.warn("Backend logout failed, continuing anyway");
        }

        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("subCategoryId");
        localStorage.removeItem("subCategory");
        
        setUser({
            userId: null,
            name: null,
            email: null,
        });
        await signOut({ callbackUrl: "/" });
    };

    const handleCancelEdit = () => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    };

    const handleSaveForm = async () => {
        try {
            const success = await editUserRequest(user.userId, name, email);
            if (success) {
                setUser((prevUser) => (prevUser ? { ...prevUser, name, email } : prevUser));
                setCanSave(false);
            }
        } catch (error) {
            console.error("Unexpected error while saving form:", error);
        }
    };

    if (sideBarOpen === null) return null;

    return (
        <AuthWrapper>
            <div className={styles.root}>
                {showDeleteCategoryWindow && (
                    <DeleteCategoryWindow
                        isCategory
                        label={tempCategory.label}
                        onCancel={handleCancelWindow}
                        onConfirm={() => {
                            triggerDeleteCategory(tempCategory.id);
                            handleCancelWindow();
                        }}
                    />
                )}
                {showChangePasswordWindow && (
                    <ChangePasswordWindow
                        onConfirm={() => setShowChangePasswordWindow(!showChangePasswordWindow)}
                        onCancel={() => setShowChangePasswordWindow(!showChangePasswordWindow)}
                    />
                )}
                <SideBar
                    retrieveSubCategory={handleSubCategory}
                    retrieveSideBarStatus={setSideBarOpen}
                    onClickDelete={(categoryId, label) => {
                        handleCancelWindow();
                        setTempCategory({ id: categoryId, label: label });
                    }}
                    ref={sideBarRef}
                    retrieveShowMenuStatus={setHideMenu}
                />
                <div
                    className={`${styles.mainContainer} ${!sideBarOpen && styles.extendedMainContainer} ${
                        !hideMenu && styles.isMenuOpen
                    }`}
                >
                    <div className={`${styles.titleContainer} ${sideBarOpen && styles.titleContainerResponsive}`}>
                        <span className={styles.title}>Settings</span>
                        <Button
                            className={styles.logoutButton}
                            variant="outlined"
                            startIcon={<BiLogOut />}
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </Button>
                    </div>
                    <div className={styles.contentContainer}>
                        <div className={styles.avatarContainer}>
                            <Badge
                                className={styles.badge}
                                overlap="circular"
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                badgeContent={<AddAPhotoIcon />}
                            >
                                <Avatar sx={{ width: 150, height: 150, fontSize: "4rem" }}>{userInitials}</Avatar>
                            </Badge>
                        </div>
                        <div className={styles.formContainer}>
                            <div className={styles.dataContainer}>
                                <div className={styles.nameContainer}>
                                    <span>Name:</span>
                                    <Input
                                        disableUnderline
                                        value={name}
                                        type="text"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.emailContainer}>
                                    <span>Email:</span>
                                    <Input
                                        disableUnderline
                                        value={email}
                                        type="text"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <Button className={styles.cancelButton} variant="outlined" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                            </div>
                            <div className={styles.buttonContainer}>
                                <Button
                                    className={styles.passwordButton}
                                    variant="outlined"
                                    onClick={() => setShowChangePasswordWindow(!showChangePasswordWindow)}
                                >
                                    Change my password
                                </Button>
                                <Button
                                    className={`${styles.saveButton} ${canSave && styles.activeButton}`}
                                    variant="contained"
                                    disabled={!canSave}
                                    onClick={handleSaveForm}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
}
