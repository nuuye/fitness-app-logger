import styles from "./home.module.scss";
import SideBar, { SideBarRef } from "../components/sideBar/sideBar";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AuthWrapper from "../components/authWrapper/authWrapper";
import DeleteCategoryWindow from "../components/deleteCategoryWindow/deleteCategoryWindow";

export default function Home() {
    const router = useRouter();
    const sideBarRef = useRef<SideBarRef>(null);

    const [sideBarOpen, setSideBarOpen] = useState<boolean | null>(null);
    const [showDeleteCategoryWindow, setShowDeleteCategoryWindow] = useState<boolean>(false);
    const [tempCategory, setTempCategory] = useState<{ id: string; label: string }>(null);
    const [hideMenu, setHideMenu] = useState<boolean>(true);

    useEffect(() => {
        setSideBarOpen(localStorage.getItem("sideBarOpen") === "true");
    }, []);

    const handleCancelWindow = () => {
        setShowDeleteCategoryWindow(!showDeleteCategoryWindow);
    };

    //handles the display of sub categories on dashboard whenever click
    const handleSubCategory = async (categoryId: string) => {
        localStorage.setItem("subCategoryId", categoryId);
        router.push("/dashboard");
    };

    const triggerDeleteCategory = (id: string) => {
        console.log("triggered");
        sideBarRef.current?.handleCategoryDelete(id);
    };

    if(sideBarOpen === null) return null;

    return (
        <>
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
                ></div>
            </div>
        </>
    );
}
