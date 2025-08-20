import './App.css'
import Register from "./ui/components/auth/Register/Register.jsx";
import Login from "./ui/components/auth/Login/Login.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./ui/components/layout/Layout/Layout.jsx";
import HomePage from "./ui/pages/HomePage/HomePage.jsx";
import SubjectsPage from "./ui/pages/SubjectsPage/SubjectsPage.jsx";
import ProtectedRoute from "./ui/components/routing/ProtectedRoute/ProtectedRoute.jsx";
import CreateSubjectPage from "./ui/pages/SubjectsPage/CreateSubjectPage.jsx";
import ExamsPage from "./ui/pages/ExamsPage/ExamsPage.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route element={<ProtectedRoute roles={["ROLE_ADMIN", "ROLE_STUDENT"]}/>}>
                        <Route path="subjects" element={<SubjectsPage/>}/>
                        <Route path="/subjects/:subjectCode/exams" element={<ExamsPage/>}/>
                    </Route>
                    <Route path="/subjects/create" element={<CreateSubjectPage/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default App;
