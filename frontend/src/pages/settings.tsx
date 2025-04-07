import styles from "./settings.module.scss";
import AuthWrapper from "../components/authWrapper/authWrapper";
import ConfirmWindow from "../components/confirmationWindow/confirmWindow";
import SideBar, { SideBarRef } from "../components/sideBar/sideBar";
import { useEffect, useRef, useState } from "react";
import { getSubCategoryRequest } from "../services/subCategory";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { BiLogOut } from "react-icons/bi";
import { logoutRequest } from "../services/user";

export default function Settings() {
    const router = useRouter();
    const sideBarRef = useRef<SideBarRef>(null);

    const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
    const [hideMenu, setHideMenu] = useState<boolean>(true);

    const [showConfirmationWindow, setShowConfirmationWindow] = useState<boolean>(false);
    const [tempCategory, setTempCategory] = useState<{ id: string; label: string }>(null);

    useEffect(() => {
        setSideBarOpen(localStorage.getItem("sideBarOpen") === "true");
    }, []);

    const triggerDeleteCategory = (id: string) => {
        console.log("triggered");
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
        setShowConfirmationWindow(!showConfirmationWindow);
    };

    const handleLogout = async (): Promise<void> => {
        const success = await logoutRequest();
        if (success) {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            router.push("/");
        }
    };

    return (
        <AuthWrapper>
            <div className={styles.root}>
                {showConfirmationWindow && (
                    <ConfirmWindow
                        isCategory
                        label={tempCategory.label}
                        onCancel={handleCancelWindow}
                        onConfirm={() => {
                            triggerDeleteCategory(tempCategory.id);
                            handleCancelWindow();
                        }}
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
                            className={`${styles.logoutButton}`}
                            variant="outlined"
                            startIcon={<BiLogOut />}
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
}
