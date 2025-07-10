import "../styles/global.scss";
import Head from "next/head";
import theme from "../styles/theme";
import { ThemeProvider } from "@mui/material";
import "@fontsource/roboto";
import { UserProvider } from "../context/userContext";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Fitlogs</title>

                {/* Favicons - utilise le chemin direct */}
                <link rel="icon" type="image/png" href="/images/dumbbell_icon.png" />
                <link rel="shortcut icon" href="/images/dumbbell_icon.png" />
            </Head>
            <ThemeProvider theme={theme}>
                <UserProvider>
                    <Component {...pageProps} />
                </UserProvider>
            </ThemeProvider>
        </>
    );
}
