import { Routes, Link, Route, BrowserRouter as Router } from "react-router-dom"
import App from "../App"
import PageCadastrar from "../Components/Pages/Cadastrar/Pagecadastrar"
import PageInicio from "../Components/Pages/Inicio/Pageinicio"


function AppRoutes(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/chromasoft/dashboard" element={<PageInicio/>}/>
                <Route path="/chromasoft/cadastrar" element={<PageCadastrar />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes