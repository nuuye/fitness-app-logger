import { InputBase, ListItemButton, ListItemIcon, ListItemText, NativeSelect, styled } from "@mui/material";
import styles from "./session.module.scss";
import AdjustIcon from "@mui/icons-material/Adjust";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";

interface sessionProps {
    label: string;
    onClick: () => void;
}

export default function Session({ label, onClick }: sessionProps) {
    const [showMore, setShowMore] = useState<boolean>(false);

    return (
        <ListItemButton
            sx={{ pl: 2, pr: 1 }}
            onMouseEnter={() => setShowMore(!showMore)}
            onMouseLeave={() => setShowMore(!showMore)}
            onClick={() => onClick}
        >
            <ListItemIcon>
                <AdjustIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} />
            {showMore && (
                <ListItemIcon>
                    <MoreHorizIcon fontSize="small" />
                </ListItemIcon>
            )}
        </ListItemButton>
    );
}
