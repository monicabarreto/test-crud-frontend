import React from 'react';
import CategoriaDropdown from './Components/CadastroProdutos';
import BuscaProduto from './Components/BuscaProduto'; // Importe o novo componente

const App: React.FC = () => {
  return (
    <div>
      <CategoriaDropdown />


      <BuscaProduto /> {/* Adicionando a busca abaixo do dropdown */}
    </div>
  );
};

export default App;
