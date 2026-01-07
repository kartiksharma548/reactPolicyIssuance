import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './app/routes/routes'
import './assets/styles/styles.css'
import theme from './app/themes/appTheme'
import { ThemeProvider } from '@mui/material/styles'
import { Typography, Box } from '@mui/material'
import DashBoard from './app/pages/DashBoardPage'
import { useEffect, useState } from 'react'

function App() {

    const [allowTab,setAllowTab] = useState(true);

    useEffect(() => {
        function messageListener(e) {
            const { data } = e;

            if (data === "ping") {
                bc.postMessage("pong");
                setAllowTab(true)
            }

            if (data === "pong") {
                alert('Multiple Tabs or Windows are not allowed.');
                setAllowTab(false)
                
            }
        }

        const bc = new BroadcastChannel("single_tab");

        bc.postMessage("ping");

        bc.addEventListener("message", messageListener);

        return () => bc.removeEventListener("message", messageListener);
    }, []);
    return (
       allowTab && < ThemeProvider theme={theme}>
            <div className="App">
                <RouterProvider router={routes} />
            </div>
        </ThemeProvider>
    )
}

export default App
