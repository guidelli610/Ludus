import { Chess } from "chess.js"

const chess = new Chess();
const move = null;

try {
    move = chess.move({from: 'b1', to: 'a4'});
} catch(e) {
    console.log("Erro: ", e);
}

try {
    move = chess.move({from: 'a7', to: 'a6'});
} catch(e) {
    console.log("Erro: ", e);
}

console.log(chess.ascii());