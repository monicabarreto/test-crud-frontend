import React, { useState, useEffect } from 'react';
import { searchProdutos, getCategorias, deleteProduto, updateProduto } from '../Api';

const BuscaProduto: React.FC = () => {
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
  const [produtos, setProdutos] = useState<{
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
    categoria: string;
  }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  


  useEffect(() => {
    const fetchCategorias = async () => {
      setCategorias(await getCategorias());
    };
    fetchCategorias();
  }, []);

  const handleSearch = async () => {
    const data = await searchProdutos(searchTerm, categoriaId ?? undefined);
    setProdutos(data);
  };

  const handleEditar = async (id: number) => {
    const produtoAtual = produtos.find((p) => p.id === id);
    if (!produtoAtual) return;

    const nome = prompt('Nome do produto:', produtoAtual.nome);
    const preco = prompt('Preço do produto:', produtoAtual.preco.toString());
    const quantidade = prompt('Quantidade:', produtoAtual.quantidade.toString());
    const categoriaSelecionada = categorias.find(c => c.nome === produtoAtual.categoria);
    const categoriaIdAtual = categoriaSelecionada?.id.toString() ?? '';

    const novaCategoriaId = prompt('ID da categoria:', categoriaIdAtual);

    if (nome && preco && quantidade && novaCategoriaId) {
      try {
        await updateProduto(id, {
          nome,
          preco: parseFloat(preco),
          quantidade: parseInt(quantidade),
          categoriaId: parseInt(novaCategoriaId),
        });

        alert('Produto atualizado com sucesso!');
        handleSearch();
      } catch (error) {
        alert('Erro ao atualizar produto.');
        console.error(error);
      }
    } else {
      alert('Todos os campos são obrigatórios para editar o produto.');
    }
  };

  const handleExcluir = async (id: number) => {
    const confirmacao = confirm('Tem certeza que deseja excluir este produto?');
    if (confirmacao) {
      try {
        await deleteProduto(id);
        alert('Produto excluído com sucesso!');
        handleSearch();
      } catch (error) {
        alert('Erro ao excluir produto.');
        console.error(error);
      }
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">BUSCAR PRODUTOS</h2>

     <div className="mb-6">
  <div className="flex gap-4 mb-3">
    <div className="flex flex-col flex-1">
      <label htmlFor="searchTerm" className="mb-1 text-gray-700 font-medium">
        Buscar por nome
      </label>
      <input
        id="searchTerm"
        type="text"
        placeholder="Buscar por nome..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div className="flex flex-col flex-1">
      <label htmlFor="categoriaId" className="mb-1 text-gray-700 font-medium">
        Buscar por Categoria
      </label>
      <select
        id="categoriaId"
        value={categoriaId ?? ''}
        onChange={(e) => setCategoriaId(Number(e.target.value))}
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Todas as categorias</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </select>
    </div>
  </div>

  <button
    onClick={handleSearch}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-md transition-colors"
  >
    Buscar
  </button>
</div>


      <h3 className="text-xl font-semibold mb-4 text-gray-700">Resultados</h3>

      {produtos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700">
                <th className="py-3 px-4 border-b border-indigo-300">Nome</th>
                <th className="py-3 px-4 border-b border-indigo-300">Preço</th>
                <th className="py-3 px-4 border-b border-indigo-300">Quantidade</th>
                <th className="py-3 px-4 border-b border-indigo-300">Categoria</th>
                <th className="py-3 px-4 border-b border-indigo-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr
                  key={produto.id}
                  className="even:bg-gray-50 hover:bg-indigo-50 transition-colors"
                >
                  <td className="py-2 px-4 border-b border-gray-200">{produto.nome}</td>
                  <td className="py-2 px-4 border-b border-gray-200">R$ {produto.preco.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{produto.quantidade}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{produto.categoria}</td>
                  <td className="py-2 px-4 border-b border-gray-200 space-x-2">
                    <button
                      onClick={() => handleEditar(produto.id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(produto.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic">Nenhum produto encontrado.</p>
      )}
    </div>
  );
};

export default BuscaProduto;
