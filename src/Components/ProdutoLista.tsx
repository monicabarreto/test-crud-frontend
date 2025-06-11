import { useEffect, useState } from "react";
import api from "../api";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  quantidade: number;
  categoria: string;
}

interface ProdutoListaProps {
  categorias: string[];
}

export default function ProdutoLista({ categorias }: ProdutoListaProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [categoriaBusca, setCategoriaBusca] = useState("");
  const [buscaTemp, setBuscaTemp] = useState(""); 
  const [categoriaTemp, setCategoriaTemp] = useState(""); 
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdit, setFormEdit] = useState<Produto | null>(null);

  const fetchProdutos = async () => {
    try {
      const res = await api.get("/");
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const aplicarFiltro = () => {
    setBusca(buscaTemp);
    setCategoriaBusca(categoriaTemp);
  };

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (categoriaBusca === "" || p.categoria === categoriaBusca)
  );

  const iniciarEdicao = (produto: Produto) => {
    setEditandoId(produto.id);
    setFormEdit({ ...produto });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setFormEdit(null);
  };

  const salvarEdicao = async () => {
    if (formEdit) {
      try {
        await api.put(`/${formEdit.id}`, formEdit);
        await fetchProdutos();
        cancelarEdicao();
      } catch (error) {
        console.error("Erro ao editar:", error);
      }
    }
  };

  const excluirProduto = async (id: number) => {
    try {
      await api.delete(`/${id}`);
      await fetchProdutos();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (formEdit) {
      setFormEdit({
        ...formEdit,
        [name]: name === "preco" || name === "quantidade" ? parseFloat(value) || 0 : value,
      });
    }
  };

  return (
    <div className="border p-4 rounded bg-white mt-4">
      <h2 className="text-xl font-bold mb-4">LISTA DE PRODUTOS:</h2>

      <div className="flex gap-4 mb-4">
        <div className="w-full">
          <label htmlFor="busca" className="block mb-1 font-medium">Buscar por nome:</label>
          <input
            id="busca"
            value={buscaTemp}
            onChange={(e) => setBuscaTemp(e.target.value)}
            placeholder="Buscar por nome"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="w-full">
          <label htmlFor="categoriaBusca" className="block mb-1 font-medium">Filtrar por categoria:</label>
          <select
            id="categoriaBusca"
            value={categoriaTemp}
            onChange={(e) => setCategoriaTemp(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={aplicarFiltro}
            className="bg-blue-500 text-white px-4 py-2 rounded h-10"
          >
            Buscar
          </button>
        </div>
      </div>

      <ul>
        {produtosFiltrados.map((produto) => (
          <li key={produto.id} className="border-b py-2 flex justify-between items-center gap-2">
            {editandoId === produto.id && formEdit ? (
              <div className="w-full grid grid-cols-5 gap-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">Nome:</label>
                  <input
                    name="nome"
                    value={formEdit.nome}
                    onChange={handleEditChange}
                    className="border p-1 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Categoria:</label>
                  <select
                    name="categoria"
                    value={formEdit.categoria}
                    onChange={handleEditChange}
                    className="border p-1 rounded w-full"
                  >
                    {categorias.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Preço:</label>
                  <input
                    name="preco"
                    type="number"
                    value={formEdit.preco}
                    onChange={handleEditChange}
                    className="border p-1 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Quantidade:</label>
                  <input
                    name="quantidade"
                    type="number"
                    value={formEdit.quantidade}
                    onChange={handleEditChange}
                    className="border p-1 rounded w-full"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button onClick={salvarEdicao} className="bg-green-500 text-white px-2 rounded h-8">Salvar</button>
                  <button onClick={cancelarEdicao} className="bg-gray-400 text-white px-2 rounded h-8">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <strong>{produto.nome}</strong> {produto.categoria} - R$ {parseFloat(produto.preco).toFixed(2)} | Qtd: {produto.quantidade} |
                
                </div>
                <div className="flex gap-2">
                  <button onClick={() => iniciarEdicao(produto)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                  <button onClick={() => excluirProduto(produto.id)} className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
