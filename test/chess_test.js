import { Chess } from "chess.js"

const chess = new Chess();

try {
    chess.move({from: 'b1', to: 'a3'});
} catch(e) {
    console.log("Erro: ", e);
}

try {
    chess.move({from: 'a7', to: 'a6'});
} catch(e) {
    console.log("Erro: ", e);
}

console.log(chess.ascii());