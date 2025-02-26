import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        button: {
            textTransform: "none",
        },
    },
    components: {
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: "30px",
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    paddingLeft: "10px",
                },
            },
        },
    },
});

export default theme;
