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
import AdjustIcon from "@mui/icons-material/Adjust";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function SideBar() {
    const [open, setOpen] = useState<boolean>(true);

    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <div className={styles.root}>
            <List component="nav" aria-labelledby="nested-list-subheader" className={styles.sessionContainer}>
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sessions" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 2 }}>
                            <ListItemIcon>
                                <AdjustIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Arms" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 2 }}>
                            <ListItemIcon>
                                <AdjustIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Back" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 2 }}>
                            <ListItemIcon>
                                <AdjustIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Chest" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 2 }}>
                            <ListItemIcon>
                                <AdjustIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Shoulders" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 2 }}>
                            <ListItemIcon>
                                <AddCircleOutlineIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Add new session" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </div>
    );
}
