import { useState } from "react";
import api from "../api";

interface Produto {
  nome: string;
  preco: string;
  quantidade: string;
  categoria: string;
 
}

interface ProdutoCadastroProps {
  categorias: string[];
  onProdutoAdicionado: () => void;
}

export default function ProdutoCadastro({ categorias, onProdutoAdicionado }: ProdutoCadastroProps) {
  const [form, setForm] = useState<Produto>({
    nome: "",
    preco: "",
    quantidade: "",
    categoria: ""
    
  });
  

  const [erro, setErro] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "preco" || name === "quantidade" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    // Verificação dos campos obrigatórios
    if (!form.nome || !form.categoria || !form.preco  || !form.quantidade) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    try {
      await api.post("/", form);
      setForm({ nome: "", preco: "", quantidade: "", categoria: ""});
      setErro(null);
      onProdutoAdicionado();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setErro("Erro ao cadastrar produto.");
    }
  };

  return (
  <div className="border p-6 rounded bg-white mb-4 shadow-sm max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 text-center">Cadastrar Produto</h2>

    {erro && <p className="text-red-600 mb-4 text-center">{erro}</p>}

    <div className="flex gap-6 mb-4">
      <div className="w-1/2">
        <label className="block mb-1 font-medium" htmlFor="nome">Descrição do Produto</label>
        <input
          id="nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Digite o nome do produto"
          className="border rounded p-3 w-full shadow-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      <div className="w-1/2">
        <label className="block mb-1 font-medium" htmlFor="categoria">Categoria</label>
        <select
          id="categoria"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="border rounded p-3 w-full shadow-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
        >
          <option value="">Selecione a categoria</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="flex gap-6 mb-4">
      <div className="w-1/2">
        <label className="block mb-1 font-medium" htmlFor="preco">Preço</label>
        <input
          id="preco"
          name="preco"
          type="number"
          step="0.01"
          min="0"
          value={form.preco}
          onChange={handleChange}
          placeholder="Digite o preço"
          className="border rounded p-3 w-full shadow-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      <div className="w-1/2">
        <label className="block mb-1 font-medium" htmlFor="quantidade">Quantidade</label>
        <input
          id="quantidade"
          name="quantidade"
          type="number"
          min="0"
          value={form.quantidade}
          onChange={handleChange}
          placeholder="Digite a quantidade"
          className="border rounded p-3 w-full shadow-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>
    </div>

    <button
      onClick={handleSubmit}
      className="bg-green-600 text-white font-semibold px-4 py-3 rounded hover:bg-green-700 w-full transition duration-200"
    >
      Cadastrar
    </button>
  </div>
);


}
