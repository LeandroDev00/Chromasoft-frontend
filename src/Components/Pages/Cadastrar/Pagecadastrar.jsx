import { useContext, useEffect, useState} from 'react'
import reactLogo from '../../../assets/react.svg'
import chromasoftLogo from '../../../assets/logo.png'
import { Link } from 'react-router-dom'
import '../../../App.css'
import ToastMessage from '../../../utils/ToastMessage.jsx'
import { ToastContainer } from 'react-toastify';
import ServiceAPI from '../../../Services/api.jsx'

function PageCadastrar() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCadastrar(){
    setLoading(true)
    // if (!titulo || !descricao) {
    //     ToastMessage.ShowInfo("Preencha todos os campos!");
    //     setLoading({...loading, loadingCriar:false})
    // }

    try {
        const response = await ServiceAPI.Cadastrar(usuario, senha, email);
        console.log("Resposta completa:", response);
        ToastMessage.ShowSuccess("Usuario cadastrado com sucesso");
    } catch (error){  
        //Verifique se o erro tem uma resposta do servidor
        if(error.response){
        console.log('Dados do erro:', error.response.data);
        console.log('Status do erro:', error.response.status);
        ToastMessage.ShowInfo(`${error.response.data.message}`);
        }else if (error.request) {
            console.log('Requisição sem resposta:', error.request);
            ToastMessage.ShowWarn('Não foi possível obter resposta do servidor. Tente novamente.');
        } else {
            console.log('Erro ao configurar a requisição:', error.message);
            ToastMessage.ShowError(`Erro ao configurar a requisição: ${error.message}`);
        }
    } finally{
        setLoading(false)
    }
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
      <h3 className='text-gray-900'>Realize o cadastro para acesso a plataforma</h3>
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
        <input
        type="email"
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5'
        placeholder='Digite o Email...'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <button
        className='w-100 bg-blue-400 hover:bg-blue-700'
        type='button'
        onClick={handleCadastrar}
        >
          {
            loading ? (
              <div className="spinner"></div>
            ) : (
              <p>Cadastrar</p>
            )
          }
        </button>
        <ToastContainer/>
        <p className='text-center text-sm text-gray-600'>
          Já possui Login ? {" "} 
          <Link to="/">Clique aqui</Link>
        </p>
      </div>
    </>
  )
}

export default PageCadastrar
