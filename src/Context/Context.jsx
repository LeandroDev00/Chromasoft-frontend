import { createContext, useState } from "react";
import ServiceAPI from "../Services/api";
import ToastMessage from "../utils/ToastMessage";

export const AuthContext = createContext({})

export function AutheProvider({children}){
    const [dados, setDados] = useState({
        usuario:"",
        token:""
    });

    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const Autenticado = !!dados.token;

    async function handleLogar({usuario, senha}){
        setLoadingAuth(true);
        if(!usuario || !senha){
            ToastMessage.ShowInfo('Preencha todos os campos !');
            setLoadingAuth(false);
            return;
        }
        try {
            const response = await ServiceAPI.Login(usuario, senha);
            console.log("response da API:", response);

            // Desestruturação correta
            const { usuario: nomeUsuario, token } = response;

            // Atualiza o estado
            setDados({ usuario: nomeUsuario, token});

            ToastMessage.ShowSuccess('Login realizado com sucesso!');
        } catch(error){  
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
            setLoadingAuth(false)
        }
    }

    return(
        <AuthContext.Provider value={{handleLogar, dados, Autenticado, loadingAuth, loading}}>
            {children}
        </AuthContext.Provider>
    )
}