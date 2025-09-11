import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import './index.css'
import App from './App.jsx'
import AuthProvider from "./providers/authProvider.jsx";
import { modernTheme } from './theme/theme.js'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={modernTheme}>
            <CssBaseline />
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
);