import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        button: {
            textTransform: "none",
        },
    },
    components: {
        MuiListItemText: {
            styleOverrides: {
                root: {
                    width: "0",
                    flexGrow: "1",
                },
                primary: {
                    fontSize: "14px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                },
            },
        },
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
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: 'red',
                },
                input: {
                    // This targets the <input> inside <OutlinedInput>
                    color: 'grey',
                },
            },
        },
    }
});

export default theme;
