import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import styles from "./subCategory.module.scss";
import AdjustIcon from "@mui/icons-material/Adjust";
import { useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Input from "@mui/material/Input";
import { editSubCategoryRequest } from "../../services/subCategory";

interface subCategoryProps {
    id: string;
    label: string;
    onClickDelete: () => void;
}

export default function SubCategory({ label, onClickDelete, id }: subCategoryProps) {
    const [showMore, setShowMore] = useState<boolean>(false);
    const [categoryLabel, setCategoryLabel] = useState<string>(label);
    const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

    //async handler to show/unshow input. When unshowing updates the database with new value
    const handleShowInput = async () => {
        if (isInputVisible && label !== categoryLabel) {
            try {
                const result = await editSubCategoryRequest(id, categoryLabel);
                console.log("result: ", result);
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
                <AdjustIcon fontSize="small" className={styles.adjustIcon} />
            </ListItemIcon>
            {isInputVisible ? (
                <Input
                    className={styles.inputContainer}
                    onChange={(e) => setCategoryLabel(e.target.value)}
                    value={categoryLabel}
                    autoFocus
                />
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
