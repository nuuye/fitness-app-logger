import { useState } from "react";
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
import { createCategoryRequest } from "../../services/category";
import { categoryType } from "../../types";

export default function SideBar() {
    const [open, setOpen] = useState<boolean>(true);
    const [categories, setCategories] = useState<categoryType[]>(null);
    const [showMorePanel, setShowMorePanel] = useState<boolean>(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleCreateSection = async () => {
        const newCategory = await createCategoryRequest("default category");
        if (newCategory) {
            setCategories((prevCategories) => (prevCategories ? [...prevCategories, newCategory] : [newCategory]));
        }
        console.log(categories);
    };

    return (
        <div className={styles.root}>
            <List component="nav" aria-labelledby="nested-list-subheader" className={styles.sessionContainer}>
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Categories" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {categories && categories.map((category, index) => <Session label={category.name} key={index} />)}
                        <ListItemButton sx={{ pl: 2 }} onClick={() => handleCreateSection()}>
                            <ListItemIcon>
                                <AddCircleOutlineIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Add new category" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </div>
    );
}
