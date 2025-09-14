import React from "react";
import {Link} from "react-router-dom";
import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Header.css";
import AuthenticationToggle from "../../auth/AuthenticationToggle/AuthenticationToggle.jsx";
import useAuth from "../../../../hooks/useAuth.js";

const pages = [
    {path: "/", name: "home"},
    {path: "/subjects", name: "subjects", roles: ["ROLE_ADMIN", "ROLE_STUDENT"]},
    {path: "/rooms", name: "rooms", roles: ["ROLE_ADMIN"]},
    {path: "/users", name: "users", roles: ["ROLE_ADMIN"]},
    {path: "/admin/register-students", name: "register students", roles: ["ROLE_ADMIN"]},
];

const Header = () => {
    const {user} = useAuth();
    const canAccess = (page) => {
        if (!page.roles) return true;
        if (!user) return false;

        return page.roles.some((r) => user.roles.includes(r));
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{mr: 3}}>
                        Exam Records Tracker App
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
                        {pages.filter(canAccess).map((page) => (
                            <Link key={page.name} to={page.path} style={{textDecoration: "none"}}>
                                <Button sx={{my: 2, color: "white", display: "block"}}>
                                    {page.name
                                        .split(" ")
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")}
                                </Button>
                            </Link>
                        ))}

                    </Box>
                    <AuthenticationToggle/>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
