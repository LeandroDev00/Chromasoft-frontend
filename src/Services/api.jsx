import axios from "axios";

const base_url = env("BASE_URL_PROD");
const base_url_Desen = "http://localhost:3000";

const api = axios.create({
    baseURL: base_url,
});

export const setAuthToken = (token) =>{
    if(token){
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        localStorage.setItem("token", token); // Armazena o token para manter sessão
    } else{
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem("token");
    }
}

const ServiceAPI = {
    Login: async (usuario, senha) => {
        try {
            const response = await api.post("/login", { 
                "usuario":usuario, 
                "senha":senha 
            });
            if(response.data.token){
                setAuthToken(response.data.token); // Definir o token para a sessão automaticamente
            }
            return response.data;
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
        }
    },

    Cadastrar: async (usuario, senha, email) =>{
        try {
            const response = await api.post("/usuario/criarUsuario", {
                "nome":usuario,
                "senha":senha,
                "email":email
            });
            return response.data;
        } catch (error) {
            console.log("Erro ao cadastar usuario");
            throw error;
        }
    },

    AddTarefa: async (titulo, descricao) => {
        try {
            const response = await api.post("/tarefa/novaTarefa",{ 
                "titulo":titulo, 
                "descricao":descricao 
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
            throw error;
        }
    },

    EditarTarefa: async (id, titulo, descricao) => {
        try {
            const response = await api.put(`/tarefa/editarTarefa?idTarefa=${id}`,{
                "titulo":titulo,
                "descricao":descricao
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao editar tarefa:", error);
            throw error;
        }
    },

    AtualizaStatus: async (id) =>{
        try {
            const response = await api.put(`/tarefa/atualizaStatus?idTarefa=${id}`);
            return response.data;
        } catch (error) {
            console.log("Erro ao atualizar o status da Tarefa")
            throw error;
        }
    },

    ObterTarefa: async (id) =>{
        try{
            const response = await api.get(`/tarefa/obterTarefa?idTarefa=${id}`);
            return response.data;
        } catch (error){
            console.log("Erro ao obter a tarefa");
            throw error;
        }
    },

    BuscarTarefas: async (titulo, descricao, status) =>{
        try {
            const response = await api.post("/tarefa/buscarTarefas",{
                "titulo":titulo,
                "descricao":descricao,
                "status":status
            });
            return response.data;
        } catch (error) {
            console.log("Erro ao buscar tarefas: ", error);
            throw error;
        }
    },

    RemoveTarefa: async (id) =>{
        try {
            const response = await api.delete(`/tarefa/excluirTarefa?idTarefa=${id}`);
            return response.data;
        } catch (error) {
            console.log("Erro ao deletar a tarefa: ", error);
            throw error;
        }
    }
};

export default ServiceAPI;