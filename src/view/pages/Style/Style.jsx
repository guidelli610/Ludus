import React from "react";

export default function Style() {
  return (
    <div className="all">
        <div style={{ padding: "30px" }} className="rows">
        <h1>H1 - Título Principal</h1>
        <h2>H2 - Subtítulo Secundário</h2>
        <h3>H3 - Subtítulo Terciário</h3>
        <h4>H4 - Subtítulo Quaternário</h4>
        <h5>H5 - Subtítulo Quinário</h5>
        <h6>H6 - Subtítulo Senário</h6>

        <p>P - Parágrafo: Este é um exemplo de parágrafo de texto, representado pelo elemento &lt;p&gt;.</p>

        <span>Span - Texto Inline</span>

        <strong>Strong - Texto em Negrito</strong>

        <em>Em - Texto em Itálico</em>

        <a href="#">A - Link de Exemplo</a>

        <blockquote>
          Blockquote - Citação em bloco: Este é um exemplo de texto citado.
        </blockquote>

        <div>
          Div - Container Genérico: Este é um container div que engloba elementos diversos.
          <ul>
            <li>UL - Lista Não Ordenada</li>
            <li>LI - Item de Lista 1</li>
            <li>LI - Item de Lista 2</li>
          </ul>
          <ol>
            <li>OL - Lista Ordenada</li>
            <li>LI - Item de Lista 1</li>
            <li>LI - Item de Lista 2</li>
          </ol>
        </div>

        <code>Code - Exemplo de Código Inline</code>

        <pre>
          Pre - Bloco de Código Pré-formatado
          const x = "exemplo";
        </pre>

        <button>Button - Botão</button>

        <input type="text" placeholder="Input - Campo de Texto" />

        <select>
          <option>Select - Opção 1</option>
          <option>Select - Opção 2</option>
        </select>

        <textarea placeholder="Textarea - Área de Texto"></textarea>

        <label htmlFor="example">Label - Rótulo</label>
        <input id="example" type="checkbox" /> Checkbox - Caixa de Seleção

        <table>
          <caption>Table - Tabela de Exemplo</caption>
          <thead>
            <tr>
              <th>TH - Cabeçalho</th>
              <th>TH - Cabeçalho</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TD - Dado</td>
              <td>TD - Dado</td>
            </tr>
            <tr>
              <td>TD - Dado</td>
              <td>TD - Dado</td>
            </tr>
          </tbody>
        </table>

        <figure>
          <img src="https://via.placeholder.com/100" alt="Placeholder" />
          <figcaption>Figcaption - Legenda da Imagem</figcaption>
        </figure>
      </div>
    </div>
  );
}
