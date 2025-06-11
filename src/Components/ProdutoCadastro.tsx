import { useState } from "react";
import api from "../api";

interface Produto {
  nome: string;
  preco: string;
  quantidade: string;
  categoria: string;
  marca: string;
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
    categoria: "",
    marca: ""
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
      setForm({ nome: "", preco: "", quantidade: "", categoria: "", marca: ""});
      setErro(null);
      onProdutoAdicionado();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setErro("Erro ao cadastrar produto.");
    }
  };

  return (
    <div className="border p-4 rounded bg-white mb-4">
      <h2 className="text-xl font-bold mb-4 text-center">Cadastrar Produto</h2>

      {erro && <p className="text-red-600 mb-3">{erro}</p>}

      <div className="mb-3">
        <label className="block mb-1 font-medium" htmlFor="nome">Descrição do Produto</label>
        <input
          id="nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Digite o nome do produto"
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="flex gap-4">
  <div className="mb-3 w-1/2">
    <label className="block mb-1 font-medium" htmlFor="nome">Marca:</label>
    <input
      id="MARCA"
      name="marca"
      value={form.marca}
      onChange={handleChange}
      placeholder="Digite a marca do produto"
      className="border p-2 rounded w-full"
    />
  </div>

  <div className="mb-3 w-1/2">
    <label className="block mb-1 font-medium" htmlFor="categoria">Categoria</label>
    <select
      id="categoria"
      name="categoria"
      value={form.categoria}
      onChange={handleChange}
      className="border p-2 rounded w-full"
    >
      <option value="">Selecione a categoria</option>
      {categorias.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  </div>
</div>


      <div className="mb-3">
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
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="quantidade">Quantidade</label>
        <input
          id="quantidade"
          name="quantidade"
          type="number"
          min="0"
          value={form.quantidade}
          onChange={handleChange}
          placeholder="Digite a quantidade"
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Cadastrar
      </button>
    </div>
  );
}
