import React, { useState, useEffect } from 'react';
import { createProduto, getCategorias } from '../Api';

const CadastroProduto: React.FC = () => {
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
  const [formData, setFormData] = useState({ nome: '', preco: 0, categoriaId: 0, quantidade: 1 });

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategorias();
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createProduto(formData);
    setFormData({ nome: '', preco: 0, categoriaId: 0, quantidade: 1 });
    alert('Produto cadastrado com sucesso!');
  };

 return (
  <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastro de Produto</h2>
    
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Nome do Produto"
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        required
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      
      <input
        type="number"
        placeholder="Preço"
        value={formData.preco}
        onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
        required
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      
      <input
        type="number"
        placeholder="Quantidade"
        value={formData.quantidade}
        onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
        required
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      
      <select
        value={formData.categoriaId}
        onChange={(e) => setFormData({ ...formData, categoriaId: parseInt(e.target.value) })}
        required
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="" disabled>Escolha uma categoria</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
        ))}
      </select>
      
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-md transition-colors"
      >
        Cadastrar Produto
      </button>
    </form>
  </div>
);

};

export default CadastroProduto;
