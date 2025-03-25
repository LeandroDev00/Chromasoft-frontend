import { useState, useEffect, useContext} from "react";
import ServiceAPI from "../../../Services/api";
import { AuthContext } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../../../utils/ToastMessage";
import { ToastContainer } from "react-toastify";

export default function PageInicio() {
    const { Autenticado, dados } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tarefas, setTarefas] = useState([]);
    const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
    const [dadosTarefa, setDadosTarefa] = useState({
        titulo:"",
        descricao:"",
        status: ""
    });
    const [dadosTarefaEditar, setDadosTarefaEditar] = useState({
        id: 0,
        titulo:"",
        descricao:"",
        status: ""
    });
    const [dadosTarefaFiltro, setDadosTarefaFiltro] = useState({
        titulo:"" || undefined,
        descricao:"" || undefined,
        status: "" || undefined
    });
    const [isModalOpen, setIsModalOpen] = useState({
        isModalOpenEditar:false,
        isModalOpenNovo:false,
        isModalOpenExcluir:false,
        isModalOpenStatus:false,
    });
    const [loading, setLoading] = useState({
        loadingCriar:false,
        loadingBuscar:false
    });

    useEffect(()=>{
        if(!Autenticado){
            navigate("/");
        } else{
            navigate("/chromasoft/dashboard");
            handleBuscarTarefa()
        }
    }, [Autenticado])

    
    async function handleCriarTarefa() {
        setLoading({...loading, loadingCriar:true})
        // if (!titulo || !descricao) {
        //     ToastMessage.ShowInfo("Preencha todos os campos!");
        //     setLoading({...loading, loadingCriar:false})
        // }

        try {
            console.log("Estados: dadosTarefa.titulo / dadosTarefa.descricao / token :", dadosTarefa.titulo, " - " ,dadosTarefa.descricao, " - ");
            const response = await ServiceAPI.AddTarefa(dadosTarefa.titulo, dadosTarefa.descricao);
            console.log("Resposta completa:", response);
            setDadosTarefa({...dadosTarefa, titulo:"", descricao:"", status:""})
            ToastMessage.ShowSuccess("Criado nova tarefa com sucesso");
            handleBuscarTarefa()
            handleFecharModal()
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
            setLoading({...loading, loadingCriar:false})
        }
    }

    async function handleObterTarefa(id){
        try {
            const response = await ServiceAPI.ObterTarefa(id);
            console.log("Resposta completa do ObterTarefa:", response);
            setDadosTarefaEditar({
                id: response.ID,
                titulo: response.TITULO, 
                descricao: response.DESCRICAO, 
                status:response.STATUS});
        } catch (error) {
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
        }
    }

    async function handleEditarTarefa(){
        setLoading({...loading, loadingCriar:true});
        setTarefas(tarefas.filter((tarefa) => tarefa.ID !== tarefaSelecionada.id));
        console.log("Tarefa selecionada por ID (Editar) : ", tarefaSelecionada)
        try {
            console.log("Estados: dadosTarefa.titulo / dadosTarefa.descricao / tarefaSelecionada :", dadosTarefa.titulo, " - " ,dadosTarefa.descricao, " - ", tarefaSelecionada);
            const response = await ServiceAPI.EditarTarefa(tarefaSelecionada, dadosTarefaEditar.titulo, dadosTarefaEditar.descricao);
            console.log("Resposta completa:", response);
            setDadosTarefaEditar({...dadosTarefaEditar, titulo:"", descricao:"", status:""})
            ToastMessage.ShowSuccess("Criado nova tarefa com sucesso");
            handleBuscarTarefa()
            handleFecharModal()
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
            setLoading({...loading, loadingCriar:false})
        }
    }

    async function handleBuscarTarefa() {
        setLoading({...loading, loadingBuscar:true})
        try {
            console.log("dados tarefa Filtro: ", dadosTarefaFiltro.titulo, " - ", dadosTarefaFiltro.descricao, " - ",dadosTarefaFiltro.status)
            const response = await ServiceAPI.BuscarTarefas(dadosTarefaFiltro.titulo, dadosTarefaFiltro.descricao, dadosTarefaFiltro.status);
            console.log("Dados recebidos da API:", response);
            setTarefas(Array.isArray(response) ? response : []);
            ToastMessage.ShowSuccess('Busca realizada com sucesso');
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
        }  finally{
            setLoading({...loading, loadingBuscar:false})
        }
    }

    async function handleExcluirTarefa() {
        setTarefas(tarefas.filter((tarefa) => tarefa.ID !== tarefaSelecionada.id));
        console.log("Tarefa selecionada por ID: ", tarefaSelecionada)
        try {
            const response = await ServiceAPI.RemoveTarefa(tarefaSelecionada);
            console.log("Resposta da API:", response);
            ToastMessage.ShowSuccess("Excluido com sucesso");
            handleBuscarTarefa()
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
        }
        handleFecharModal();
    }

    async function handleAtualizaStatus(){
        setTarefas(tarefas.filter((tarefa) => tarefa.ID !== tarefaSelecionada.id));
        console.log("Tarefa selecionada por ID (Status) : ", tarefaSelecionada)
        try {
            const response = await ServiceAPI.AtualizaStatus(tarefaSelecionada);
            console.log("Resposta da API (Status):", response);
            ToastMessage.ShowSuccess("Status atualizado com sucesso");
            handleBuscarTarefa()
        } catch (error) {
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
        }
        handleFecharModal();
    }

    function handleLimpar(){
        setDadosTarefaFiltro({...dadosTarefaFiltro, titulo:"", descricao:"", status:""})
    }

    function handleLimparNovaTarefa(){
        setDadosTarefa({...dadosTarefaFiltro, titulo:"", descricao:"", status:""})
    }

    function handleAbrirModalExcluir(tarefa){
        setTarefaSelecionada(tarefa);
        setIsModalOpen({...isModalOpen, isModalOpenExcluir:true});
    }
    async function handleAbrirModalEditar(id){
        setTarefaSelecionada(id);
        setIsModalOpen({...isModalOpen, isModalOpenEditar:true});
        handleObterTarefa(id)
    }
    function handleAbrirModalStatus(tarefa){
        setTarefaSelecionada(tarefa);
        setIsModalOpen({...isModalOpen, isModalOpenStatus:true});
    }
    function handleAbrirModalNovo(){
        setIsModalOpen({...isModalOpen, isModalOpenNovo:true});
    }

    function handleFecharModal(){
        setIsModalOpen({...isModalOpen, isModalOpenEditar:false, isModalOpenNovo:false, isModalOpenExcluir:false, isModalOpenStatus:false});
        setTarefaSelecionada(null)
    }

    
    return (
        <>
        <div className="rounded-lg bg-blue">
            <div className="flex justify-start bg-white text-sm text-gray-700">
            <div class="relative w-10 h-10 ml-3 mt-2 overflow-hidden bg-gray-100 rounded-full dark:bg-blue-300">
                <svg class="absolute w-12 h-12 text-blue-600 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
                <p className="ml-3 mt-3 text-blue-400 text-lg font-bold mb-2">{dados.usuario}</p>
            </div>
        </div>
        {/* Seção de Criar Tarefa */}
        <form className="flex flex-col bg-white shadow-md rounded pt-5 pb-9 mb-2">
            <div className="flex flex-col mb-2">
                <label className="flex ml-5 text-gray-700 text-sm font-bold mb-4" htmlFor="titulo">
                    Título
                </label>
                <input
                    className="ml-5 shadow border rounded py-2 px-2 text-gray-700 leading-tight w-200"
                    id="titulo"
                    type="text"
                    placeholder="Título"
                    value={dadosTarefaFiltro.titulo}
                    onChange={(e) => setDadosTarefaFiltro({...dadosTarefaFiltro, titulo: e.target.value})}
                />

                <label className="flex ml-5 text-gray-700 text-sm font-bold mb-4 mt-5" htmlFor="descricao">
                    Descrição
                </label>
                <textarea
                    className="ml-5 shadow border rounded py-1 px-2 text-gray-700 leading-tight w-200 h-sm"
                    id="descricao"
                    placeholder="Descrição"
                    value={dadosTarefaFiltro.descricao}
                    onChange={(e) => setDadosTarefaFiltro({...dadosTarefaFiltro, descricao: e.target.value})}
                />
                <label for="status" class="flex ml-5 mb-4 mt-4 text-sm font-medium text-gray-600">Status da tarefa para busca</label>
                <select 
                id="status"
                value={dadosTarefaFiltro.status}
                onChange={(e) => setDadosTarefaFiltro({...dadosTarefaFiltro, status: e.target.value})}
                class="ml-5 bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-100 p-2.5 light:bg-white-700 light:border-blue-600 light:placeholder-gray-400 light:text-black">
                    <option value="">Selecione um status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Concluido">Concluido</option>
                </select>
            </div>
            <div className="flex justify-end gap-3">
                <button
                    className="bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleAbrirModalNovo}
                >
                    <p>Nova tarefa</p>
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleBuscarTarefa}
                >
                    {
                        loading.loadingBuscar ? (
                        <div className="spinner"></div>
                        ) : (
                        <p>Buscar Tarefas</p>
                        )
                    }
                </button>
                <button
                    className="bg-yellow-300 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleLimpar}
                >
                <p>Limpar</p>
                </button>
                <ToastContainer/>
            </div>
        </form>
        
        {/* Seção da Lista de Tarefas */}
        <div className="bg-white shadow-md rounded w-full max-w-none">
                <h2 className="text-gray-700 text-lg font-bold mb-4">Lista de Tarefas</h2>
                {loading.loadingBuscar ? (
                    <div className="w-300 bg-blue-500">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-gray-500 border px-4 py-2">ID</th>
                                <th className="text-gray-500 border px-4 py-2">Título</th>
                                <th className="text-gray-500 border px-4 py-2">Descrição</th>
                                <th className="text-gray-500 border px-4 py-2">Status</th>
                                <th className="text-gray-500 border px-4 py-2">Data</th>
                                <th className="text-gray-500 border px-4 py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tarefas.map((tarefa) => (
                                <tr key={tarefa.ID} 
                                className={`border
                                    ${tarefa.STATUS === "Pendente" ? "bg-red-200 hover:bg-red-300":""}
                                    ${tarefa.STATUS === "Concluido" ? "bg-green-200 hover:bg-green-300":""}
                                `}>
                                    <td className="text-gray-700 border px-4 py-2 text-center">{tarefa.ID}</td>
                                    <td className="text-gray-700 border px-4 py-2">{tarefa.TITULO}</td>
                                    <td className="text-gray-700 border px-4 py-2">{tarefa.DESCRICAO}</td>
                                    <td className="text-gray-700 border px-4 py-2">{tarefa.STATUS}</td>
                                    <td className="text-gray-700 border px-4 py-2 text-center">{new Date(tarefa.DTCADASTRO).toLocaleDateString("pt-BR")}</td>
                                    <td className="flex text-gray-500 border px-4 py-2 text-center gap-2">
                                        <button
                                            className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded text-sm"
                                            onClick={() => handleAbrirModalEditar(tarefa.ID)}
                                        >
                                            editar
                                        </button>
                                        <button
                                            className="bg-green-700 hover:bg-green-500 text-white font-bold py-1 px-3 rounded text-sm"
                                            onClick={() => handleAbrirModalStatus(tarefa.ID)}
                                        >
                                            concluir
                                        </button>
                                        <button
                                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded text-sm"
                                            onClick={() => handleAbrirModalExcluir(tarefa.ID)}
                                        >
                                            excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* MODAL Nova Tarefa*/}
                { isModalOpen.isModalOpenNovo && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-5 shadow-lg w-350 h-150 border-blue-500">
                            <h3 className="mb-5 text-lg font-normal text-gray-100 bg-green-500">Adicionar nova tarefa</h3>
                            <form>
                                <div className="flex flex-col mb-2">
                                <label className="flex ml-5 text-gray-900 text-sm font-bold mb-4" htmlFor="titulo">
                                    Título
                                </label>
                                <input
                                    className="ml-5 shadow border rounded py-2 px-2 text-gray-700 leading-tight w-300"
                                    id="titulo"
                                    type="text"
                                    placeholder="Título"
                                    value={dadosTarefa.titulo}
                                    onChange={(e) => setDadosTarefa({...dadosTarefa, titulo: e.target.value})}
                                />

                                <label className="flex ml-5 text-gray-900 text-sm font-bold mb-4 mt-5" htmlFor="descricao">
                                    Descrição
                                </label>
                                <textarea
                                    className="ml-5 shadow border rounded py-1 px-2 text-gray-900 leading-tight w-300 h-50"
                                    id="descricao"
                                    placeholder="Descrição"
                                    value={dadosTarefa.descricao}
                                    onChange={(e) => setDadosTarefa({...dadosTarefa, descricao: e.target.value})}
                                />
                            </div>

                            </form>
                            <div className="flex justify-end gap-2 mt-10">
                                <button
                                className="text-white bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 w-70"
                                onClick={handleCriarTarefa}
                                >
                                {
                                    loading.loadingCriar ? (
                                    <div className="spinner"></div>
                                    ) : (
                                    <p>Salvar</p>
                                    )
                                }
                                </button>
                                <button
                                onClick={handleFecharModal}
                                className="py-2.5 px-5 text-sm font-medium text-white bg-red-600 border border-gray-200 rounded-lg hover:bg-red-800 hover:text-white"
                                >
                                Fechar
                                </button>
                                <button
                                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleLimparNovaTarefa}
                                >
                                <p>Limpar</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* MODAL EDITAR*/}
                { isModalOpen.isModalOpenEditar && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-5 shadow-lg w-350 h-150 border-blue-500">
                            <h3 className="mb-5 text-lg font-normal text-gray-100 bg-yellow-600">Editar tarefa</h3>
                            <form>
                                <div className="flex flex-col mb-2">
                                <label className="flex ml-5 text-gray-900 text-sm font-bold mb-4" htmlFor="titulo">
                                    ID Tarefa: {dadosTarefaEditar.id}
                                </label>
                                <label className="flex ml-5 text-gray-900 text-sm font-bold mb-4" htmlFor="titulo">
                                    Título
                                </label>
                                <input
                                    className="ml-5 shadow border rounded py-2 px-2 text-gray-700 leading-tight w-300"
                                    id="titulo"
                                    type="text"
                                    placeholder="Título"
                                    value={dadosTarefaEditar.titulo}
                                    onChange={(e) => setDadosTarefaEditar({...dadosTarefaEditar, titulo: e.target.value})}
                                />

                                <label className="flex ml-5 text-gray-900 text-sm font-bold mb-4 mt-5" htmlFor="descricao">
                                    Descrição
                                </label>
                                <textarea
                                    className="ml-5 shadow border rounded py-1 px-2 text-gray-900 leading-tight w-300 h-50"
                                    id="descricao"
                                    placeholder="Descrição"
                                    value={dadosTarefaEditar.descricao}
                                    onChange={(e) => setDadosTarefaEditar({...dadosTarefaEditar, descricao: e.target.value})}
                                />
                            </div>

                            </form>
                            <div className="flex justify-end gap-2 mt-10">
                                <button
                                className="text-white bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 w-70"
                                onClick={handleEditarTarefa}
                                >
                                {
                                    loading.loadingCriar ? (
                                    <div className="spinner"></div>
                                    ) : (
                                    <p>Atualiza</p>
                                    )
                                }
                                </button>
                                <button
                                onClick={handleFecharModal}
                                className="py-2.5 px-5 text-sm font-medium text-white bg-red-600 border border-gray-200 rounded-lg hover:bg-red-800 hover:text-white"
                                >
                                Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* MODAL Excluir*/}
                { isModalOpen.isModalOpenExcluir && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-gray-100 rounded-lg p-5 shadow-lg w-96">
                            <h3 className="mb-5 text-lg font-normal text-gray-700">Tem certeza que deseja excluir a tarefa ?</h3>
                            <div className="flex justify-between">
                                <button
                                className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
                                onClick={handleExcluirTarefa}
                                >
                                Sim, excluir
                                </button>
                                <button
                                onClick={handleFecharModal}
                                className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                                >
                                Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )
                }
                {/* MODAL Status*/}
                { isModalOpen.isModalOpenStatus && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-gray-100 rounded-lg p-5 shadow-lg w-96">
                            <h3 className="mb-5 text-lg font-normal text-gray-700">Sua tarefa está finalizada ?</h3>
                            <div className="flex justify-between">
                                <button
                                className="text-white bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
                                onClick={handleAtualizaStatus}
                                >
                                Sim
                                </button>
                                <button
                                onClick={handleFecharModal}
                                className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                                >
                                Não
                                </button>
                            </div>
                        </div>
                    </div>
                )
                }
            </div>
        </>
    );
}
