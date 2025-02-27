import { InputBase, ListItemButton, ListItemIcon, ListItemText, NativeSelect, styled } from "@mui/material";
import styles from "./session.module.scss";
import AdjustIcon from "@mui/icons-material/Adjust";
import { useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

interface sessionProps {
    label: string;
    onClick?: () => void;
}

export default function Session({ label, onClick }: sessionProps) {
    const [showMore, setShowMore] = useState<boolean>(false);

    return (
        <ListItemButton
            sx={{ pl: 2, pr: 1 }}
            onMouseEnter={() => setShowMore(true)}
            onMouseLeave={() => setShowMore(false)}
            onClick={() => onClick}
        >
            <ListItemIcon>
                <AdjustIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} />
            {showMore && (
                <ListItemIcon>
                    <BorderColorIcon fontSize="small" />
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
            )}
        </ListItemButton>
    );
}
