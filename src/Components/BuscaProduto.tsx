import React, { useState, useEffect } from 'react';
import { searchProdutos, getCategorias } from '../Api';

const BuscaProduto: React.FC = () => {
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
  const [produtos, setProdutos] = useState<{ id: number; nome: string; preco: number; quantidade: number; categoria: string }[]>([]);
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

 return (
  <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Buscar Produtos</h2>

    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Buscar por nome..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <select
        value={categoriaId ?? ''}
        onChange={(e) => setCategoriaId(Number(e.target.value))}
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Todas as categorias</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
        ))}
      </select>

      <button
        onClick={handleSearch}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-md transition-colors"
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
