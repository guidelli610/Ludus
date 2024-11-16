import React from 'react';
import whitePawn from '/assetsChess/w_pawn_svg_withShadow.svg';
import whiteRook from '/assetsChess/w_rook_svg_withShadow.svg';
import whiteKnight from '/assetsChess/w_knight_svg_withShadow.svg';
import whiteBishop from '/assetsChess/w_bishop_svg_withShadow.svg';
import whiteQueen from '/assetsChess/w_queen_svg_withShadow.svg';
import whiteKing from '/assetsChess/w_king_svg_withShadow.svg';

import blackPawn from '/assetsChess/b_pawn_svg_withShadow.svg';
import blackRook from '/assetsChess/b_rook_svg_withShadow.svg';
import blackKnight from '/assetsChess/b_knight_svg_withShadow.svg';
import blackBishop from '/assetsChess/b_bishop_svg_withShadow.svg';
import blackQueen from '/assetsChess/b_queen_svg_withShadow.svg';
import blackKing from '/assetsChess/b_king_svg_withShadow.svg';

const pieceImages = { 
    wp: whitePawn, wr: whiteRook, wn: whiteKnight, wb: whiteBishop, wq: whiteQueen, wk: whiteKing, 
    bp: blackPawn, br: blackRook, bn: blackKnight, bb: blackBishop, bq: blackQueen, bk: blackKing
};

function IconChess({ piece, onDragStart, onDragEnd, onDragOver, onDrop }) {
    const imgSrc = pieceImages[piece];
    return (
        <div
            style={{ width: '50px', height: '50px', userSelect: 'none', cursor: 'grab' }} // Adicionei cursor: grab
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {imgSrc && <img src={imgSrc} alt={piece} />}
        </div>
    );
}

export default IconChess;