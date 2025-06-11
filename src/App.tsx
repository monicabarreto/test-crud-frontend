import ProdutoCadastro from "./Components/ProdutoCadastro";
import ProdutoLista from "./Components/ProdutoLista";
import { useState } from "react";

export default function ProdutoCRUD() {
  const categorias = ["Sedan", "SUV", "Hatch", "Pickup", "Conversível"];
  const [atualizar, setAtualizar] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ProdutoCadastro categorias={categorias} onProdutoAdicionado={() => setAtualizar(!atualizar)} />
      <ProdutoLista categorias={categorias} key={atualizar.toString()} />
    </div>
  );
}
