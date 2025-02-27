import { ListItemButton, ListItemIcon, ListItemText, NativeSelect, styled } from "@mui/material";
import styles from "./session.module.scss";
import AdjustIcon from "@mui/icons-material/Adjust";
import { useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Input from "@mui/material/Input";
import { editCategoryRequest } from "../../services/category";

interface sessionProps {
    id: string;
    label: string;
    onClickDelete: () => void;
}

export default function Session({ label, onClickDelete, id }: sessionProps) {
    const [showMore, setShowMore] = useState<boolean>(false);
    const [categoryLabel, setCategoryLabel] = useState<string>(label);
    const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

    const handleShowInput = async () => {
        if (isInputVisible && label !== categoryLabel) {
            try {
                await editCategoryRequest(id, categoryLabel);
            } catch (error) {
                console.log("error editing category", error);
            }
        }
        setIsInputVisible(!isInputVisible);
    };

    return (
        <ListItemButton
            sx={{ pl: 2, pr: 1 }}
            onMouseEnter={() => setShowMore(true)}
            onMouseLeave={() => setShowMore(false)}
        >
            <ListItemIcon>
                <AdjustIcon fontSize="small" />
            </ListItemIcon>
            {isInputVisible ? (
                <Input onChange={(e) => setCategoryLabel(e.target.value)} value={categoryLabel} autoFocus />
            ) : (
                <ListItemText primary={categoryLabel} />
            )}
            {showMore && (
                <ListItemIcon className={styles.iconContainer}>
                    <BorderColorIcon onClick={handleShowInput} className={styles.editIcon} fontSize="small" />
                    <DeleteIcon onClick={onClickDelete} className={styles.deleteIcon} fontSize="small" />
                </ListItemIcon>
            )}
        </ListItemButton>
    );
}
