import { useEffect, useState } from "react";
import api from "../api";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

export default function ProdutoCRUD() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<Omit<Produto, "id">>({
    nome: "",
    preco: 0,
    quantidade: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [busca, setBusca] = useState<string>("");

  // Buscar produtos do backend
  const fetchProdutos = async () => {
    try {
      const res = await api.get("/");
      setProdutos(res.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Atualizar inputs do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "nome") {
    setForm((prev) => ({ ...prev, nome: value }));
  } else if (name === "preco") {
 
    const numericValue = value.replace(",", ".").replace(/[^0-9.]/g, "");
    if (!isNaN(Number(numericValue))) {
      setForm((prev) => ({ ...prev, preco: parseFloat(numericValue) || 0 }));
    }
  } else if (name === "quantidade") {
    const numericValue = value.replace(/[^0-9]/g, ""); // só números inteiros
    if (!isNaN(Number(numericValue))) {
      setForm((prev) => ({ ...prev, quantidade: parseInt(numericValue) || 0 }));
    }
  }
};
  // Enviar cadastro
  const handleSubmit = async () => {
    try {
      if (editId === null) {
        await api.post("/", form);
      } else {
        await api.put(`/${editId}`, form);
        setEditId(null);
      }
      setForm({ nome: "", preco: 0, quantidade: 0 });
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  // Editar produto
  const handleEdit = (produto: Produto) => {
    setForm({ nome: produto.nome, preco: produto.preco, quantidade: produto.quantidade });
    setEditId(produto.id);
  };

  // Excluir produto
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/${id}`);
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  // Filtro por nome (produtos vendidos)
  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-lg shadow-md bg-white">
  <h1 className="text-2xl font-bold mb-4">Cadastro de Produtos</h1>

  <div className="flex flex-col gap-2 mb-4">
    <label className="font-medium" htmlFor="nome">Nome do Produto:</label>
    <input
      id="nome"
      className="border p-2 rounded"
      placeholder="Digite o nome do produto"
      name="nome"
      value={form.nome}
      onChange={handleChange}
    />

    <label className="font-medium" htmlFor="preco">Preço:</label>
    <input
      id="preco"
      className="border p-2 rounded"
      placeholder="Ex: 19,90"
      name="preco"
      type="text"
      value={form.preco.toString().replace(".", ",")}
      onChange={handleChange}
    />

    <label className="font-medium" htmlFor="quantidade">Quantidade:</label>
    <input
      id="quantidade"
      className="border p-2 rounded"
      placeholder="Digite a quantidade disponível"
      name="quantidade"
      type="number"
      value={form.quantidade}
      onChange={handleChange}
    />

    <button
      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2"
      onClick={handleSubmit}
    >
      {editId !== null ? "Atualizar" : "Cadastrar"}
    </button>
  </div>

  <div className="mb-4">
    <label className="font-medium" htmlFor="busca">Buscar produtos vendidos:</label>
    <input
      id="busca"
      type="text"
      placeholder="Digite o nome do produto..."
      className="w-full border p-2 rounded"
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
    />
  </div>

  <ul>
    {produtosFiltrados.map((produto) => (
      <li
        key={produto.id}
        className="border-b py-2 flex justify-between items-center"
      >
        <div>
          <strong>{produto.nome}</strong> - R$ {produto.preco.toFixed(2).replace(".", ",")} | Quantidade: {produto.quantidade}
        </div>
        <div className="flex gap-2">
          <button
            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
            onClick={() => handleEdit(produto)}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={() => handleDelete(produto.id)}
          >
            Excluir
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>

  );
}
