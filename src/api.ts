import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7168/api',
});


export const getCategorias = async () => {
  try {
    const response = await api.get('/Categorias');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
};


export const createProduto = async (produto: { nome: string; preco: number; categoriaId: number; quantidade: number }) => {
  try {
    const response = await api.post('/Produto', produto);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
  }
};


export const getProdutos = async () => {
  try {
    const response = await api.get('/Produto');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

// por ID
export const updateProduto = async (id: number, produto: { nome: string; preco: number; categoriaId: number; quantidade: number }) => {
  try {
    const response = await api.put(`/Produto/${id}`, produto);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
  }
};

//por ID
export const deleteProduto = async (id: number) => {
  try {
    await api.delete(`/Produto/${id}`);
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
  }
};

// Buscar produtos por nome ou categoria
export const searchProdutos = async (nome?: string, categoriaId?: number) => {
  try {
    const response = await api.get('/Produto', {
      params: { nome, categoriaId },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};

export default api;
