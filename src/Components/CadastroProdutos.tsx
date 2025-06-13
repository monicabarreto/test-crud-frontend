import React, { useState, useEffect } from 'react';
import { createProduto, getCategorias } from '../Api';

const formatarPreco = (valor: string) => {
  const numeros = valor.replace(/\D/g, '');
  const numeroFloat = parseFloat(numeros) / 100;
  if (isNaN(numeroFloat)) return '';
  return numeroFloat.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const desformatarPreco = (valorFormatado: string) => {
  return parseFloat(valorFormatado.replace(/[^\d]/g, '')) / 100;
};

const CadastroProduto: React.FC = () => {
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    categoriaId: 0,
    quantidade: ''
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategorias();
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const precoNumerico = desformatarPreco(formData.preco);
    const quantidadeNumerica = parseInt(formData.quantidade);

    await createProduto({
      ...formData,
      preco: precoNumerico,
      quantidade: quantidadeNumerica
    });

    setFormData({ nome: '', preco: '', categoriaId: 0, quantidade: '' });
    alert('Produto cadastrado com sucesso!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
     CADASTRO DE PRODUTOS
    </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
            <input
              type="text"
              placeholder="Digite o nome do produto"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
           <select
  value={formData.categoriaId || ""}
  onChange={(e) =>
    setFormData({ ...formData, categoriaId: parseInt(e.target.value) })
  }
  required
  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
>
  <option value="" disabled hidden>
    Escolha uma categoria
  </option>
  {categorias.map((categoria) => (
    <option key={categoria.id} value={categoria.id}>
      {categoria.nome}
    </option>
  ))}
</select>

          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Digite o preço"
              value={formData.preco}
              onChange={(e) => {
                const valorFormatado = formatarPreco(e.target.value);
                setFormData({ ...formData, preco: valorFormatado });
              }}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Digite a quantidade"
              value={formData.quantidade}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setFormData({ ...formData, quantidade: val });
                }
              }}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

       <button
  type="submit"
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-md transition-colors"
>
  Cadastrar Produto
</button>
      </form>
    </div>
  );
};

export default CadastroProduto;
