import { useContext, useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import chromasoftLogo from './assets/logo.png'
import { Link, useNavigate} from 'react-router-dom'
import './App.css'
import { AuthContext } from './Context/Context.jsx'
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const { handleLogar, loadingAuth, Autenticado} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
    console.log("Login: ", Autenticado);
    if(!Autenticado){
      navigate("/");
    } else{
      navigate("/chromasoft/dashboard");
    }
  }, [Autenticado])
  async function handleLogin(){
    await handleLogar({usuario, senha});
  }

  return (
    <>
      <div className='flex gap-4'>
        <a href="https://chromasoft.com.br/" target="_blank">
          <img src={chromasoftLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h3 className='text-gray-900'>Realize o login para acesso</h3>
      <div className="p-5 flex flex-col gap-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
        <input
        type='text'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5'
        placeholder='Digite o Usuario...'
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        />
        <input
        type='password'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5'
        placeholder='Digite a Senha...'
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        />
        <button
        className='w-100 bg-blue-400 hover:bg-blue-700'
        type='button'
        onClick={handleLogin}
        >
          {
            loadingAuth ? (
              <div className="spinner"></div>
            ) : (
              <p>Conectar</p>
            )
          }
        </button>
        <ToastContainer/>
        <p className='text-center text-sm text-gray-600'>
          Realize o cadastro para Login ? {" "} 
          <Link to="/chromasoft/cadastrar">Clique aqui.</Link>
        </p>
      </div>
    </>
  )
}

export default App
