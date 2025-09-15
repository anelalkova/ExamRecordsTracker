import './App.css'
import Login from "./ui/components/auth/Login/Login.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./ui/components/layout/Layout/Layout.jsx";
import HomePage from "./ui/pages/HomePage/HomePage.jsx";
import SubjectsPage from "./ui/pages/SubjectsPage/SubjectsPage.jsx";
import ProtectedRoute from "./ui/components/routing/ProtectedRoute/ProtectedRoute.jsx";
import CreateSubjectPage from "./ui/pages/SubjectsPage/CreateSubjectPage.jsx";
import ExamsPage from "./ui/pages/ExamsPage/ExamsPage.jsx";
import CreateExamPage from "./ui/pages/ExamsPage/CreateExamPage.jsx";
import RoomsPage from "./ui/pages/RoomsPage/RoomsPage.jsx";
import UsersPage from "./ui/pages/UsersPage/UsersPage.jsx";
import ChangePasswordPage from "./ui/pages/ChangePasswordPage/ChangePasswordPage.jsx";
import AdminRegistrationPage from "./ui/pages/AdminRegistrationPage/AdminRegistrationPage.jsx";
import Register from "./ui/components/auth/Register/Register.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/change-password" element={<ChangePasswordPage/>}/>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route element={<ProtectedRoute roles={["ROLE_ADMIN", "ROLE_STUDENT"]}/>}>
                        <Route path="subjects" element={<SubjectsPage/>}/>
                        <Route path="/subjects/:subjectCode/exams" element={<ExamsPage/>}/>
                    </Route>
                    <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]}/>}>
                        <Route path="/users/create" element={<Register />} />
                        <Route path="/subjects/create" element={<CreateSubjectPage />} />
                        <Route path="/subjects/:code/edit" element={<CreateSubjectPage />} />
                        <Route path="/subjects/:subjectCode/create-exam" element={<CreateExamPage/>}/>
                        <Route path="/rooms" element={<RoomsPage/>}/>
                        <Route path="/users" element={<UsersPage/>}/>
                        <Route path="/admin/register-students" element={<AdminRegistrationPage/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
