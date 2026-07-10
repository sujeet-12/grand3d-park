import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Award, Check, User, ShieldAlert, Cpu, Trophy } from 'lucide-react';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type Board = (Piece | null)[][];

interface Position {
  r: number;
  c: number;
}

// Unicode Chess Pieces with gorgeous presentation symbols
const UNICODE_PIECES: Record<PieceColor, Record<PieceType, string>> = {
  w: {
    k: '♔',
    q: '♕',
    r: '♖',
    b: '♗',
    n: '♘',
    p: '♙'
  },
  b: {
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟'
  }
};

const INITIAL_BOARD: Board = [
  [
    { type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'q', color: 'b' },
    { type: 'k', color: 'b' }, { type: 'b', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }
  ],
  [
    { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' },
    { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }
  ],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  [
    { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' },
    { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }
  ],
  [
    { type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'q', color: 'w' },
    { type: 'k', color: 'w' }, { type: 'b', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }
  ]
];

function ChessPiece({ color, type, sizeClass = "w-full h-full p-1.5 md:p-2" }: { color: PieceColor; type: PieceType; sizeClass?: string; key?: any }) {
  const fill = color === 'w' ? '#ffffff' : '#111827';
  const stroke = color === 'w' ? '#111827' : '#ffffff';

  switch (type) {
    case 'p':
      return (
        <svg viewBox="0 0 40 40" className={`${sizeClass} drop-shadow-md select-none pointer-events-none transition-transform group-hover:scale-108 active:scale-95`} style={{ display: 'inline-block' }}>
          <rect x="10" y="32" width="20" height="4" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 14,32 C 14,24 17,20 17,16 C 15,16 14,14 15,12 C 16,10 18,10 20,10 C 22,10 24,10 25,12 C 26,14 25,16 23,16 C 23,20 26,24 26,32 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <circle cx="20" cy="10" r="4.5" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 'r':
      return (
        <svg viewBox="0 0 40 40" className={`${sizeClass} drop-shadow-md select-none pointer-events-none transition-transform group-hover:scale-108 active:scale-95`} style={{ display: 'inline-block' }}>
          <rect x="10" y="32" width="20" height="4" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
          <rect x="12" y="16" width="16" height="16" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 10,12 L 10,16 L 30,16 L 30,12 L 26,12 L 26,14 L 22,14 L 22,12 L 18,12 L 18,14 L 14,14 L 14,12 Z" fill={fill} stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 'n':
      return (
        <svg viewBox="0 0 40 40" className={`${sizeClass} drop-shadow-md select-none pointer-events-none transition-transform group-hover:scale-108 active:scale-95`} style={{ display: 'inline-block' }}>
          <rect x="10" y="32" width="20" height="4" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 12,32 C 12,24 14,18 18,14 C 18,14 15,15 14,13 C 13,11 14,8 18,8 C 22,8 26,10 28,14 C 30,18 28,26 28,32 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <circle cx="16" cy="13" r="1.2" fill={stroke} />
        </svg>
      );
    case 'b':
      return (
        <svg viewBox="0 0 40 40" className={`${sizeClass} drop-shadow-md select-none pointer-events-none transition-transform group-hover:scale-108 active:scale-95`} style={{ display: 'inline-block' }}>
          <rect x="10" y="32" width="20" height="4" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 12,32 C 12,24 16,16 20,11 C 24,16 28,24 28,32 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 20,7 L 20,11 M 18,9 L 22,9" fill="none" stroke={stroke} strokeWidth="2" />
          <path d="M 18,16 L 22,20" fill="none" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 'q':
      return (
        <svg viewBox="0 0 40 40" className={`${sizeClass} drop-shadow-md select-none pointer-events-none transition-transform group-hover:scale-108 active:scale-95`} style={{ display: 'inline-block' }}>
          <rect x="10" y="32" width="20" height="4" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 12,32 L 14,16 L 19,24 L 20,12 L 21,24 L 26,16 L 28,32 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <circle cx="14" cy="15" r="1.5" fill={stroke} />
          <circle cx="20" cy="11" r="1.5" fill={stroke} />
          <circle cx="26" cy="15" r="1.5" fill={stroke} />
        </svg>
      );
    case 'k':
      return (
        <svg viewBox="0 0 40 40" className={`${sizeClass} drop-shadow-md select-none pointer-events-none transition-transform group-hover:scale-108 active:scale-95`} style={{ display: 'inline-block' }}>
          <rect x="10" y="32" width="20" height="4" rx="1" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 12,32 L 14,16 L 20,20 L 26,16 L 28,32 Z" fill={fill} stroke={stroke} strokeWidth="2" />
          <path d="M 14,16 C 16,14 24,14 26,16" fill="none" stroke={stroke} strokeWidth="2" />
          <path d="M 20,8 L 20,14 M 17,11 L 23,11" fill="none" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
}

interface ChessGameProps {
  onClose: () => void;
  audioEnabled?: boolean;
  onPlayMoveSound?: () => void;
  onPlayCaptureSound?: () => void;
  onPlayWinSound?: () => void;
}

export function ChessGame({
  onClose,
  audioEnabled = true,
  onPlayMoveSound,
  onPlayCaptureSound,
  onPlayWinSound
}: ChessGameProps) {
  const [board, setBoard] = useState<Board>(JSON.parse(JSON.stringify(INITIAL_BOARD)));
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [turn, setTurn] = useState<PieceColor>('w'); // 'w' = Player, 'b' = AI
  const [gameStatus, setGameStatus] = useState<'playing' | 'win_w' | 'win_b' | 'draw'>('playing');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Time control states
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [whiteTime, setWhiteTime] = useState<number>(300);
  const [blackTime, setBlackTime] = useState<number>(300);

  // Countdown timer effect
  useEffect(() => {
    if (timeLimit === null || gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            setGameStatus('win_b'); // Black (AI) wins on time!
            if (onPlayWinSound && audioEnabled) onPlayWinSound();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            setGameStatus('win_w'); // White (Player) wins on time!
            if (onPlayWinSound && audioEnabled) onPlayWinSound();
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [turn, gameStatus, timeLimit, audioEnabled, onPlayWinSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

  // Basic geometric Move Validation (Rook, Bishop, Knight, etc. paths)
  const isValidMoveBasic = (
    fromR: number,
    fromC: number,
    toR: number,
    toC: number,
    currentBoard: Board
  ): boolean => {
    if (!inBounds(fromR, fromC) || !inBounds(toR, toC)) return false;
    if (fromR === toR && fromC === toC) return false;

    const piece = currentBoard[fromR][fromC];
    if (!piece) return false;

    const target = currentBoard[toR][toC];
    if (target && target.color === piece.color) return false; // Can't capture own piece

    const dr = toR - fromR;
    const dc = toC - fromC;
    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    switch (piece.type) {
      case 'p': {
        const dir = piece.color === 'w' ? -1 : 1;
        const startRow = piece.color === 'w' ? 6 : 1;

        // 1 Step Forward
        if (dc === 0 && dr === dir && !target) {
          return true;
        }
        // 2 Steps Forward from start row
        if (dc === 0 && fromR === startRow && dr === 2 * dir) {
          const middleRow = fromR + dir;
          if (!currentBoard[middleRow][fromC] && !target) {
            return true;
          }
        }
        // Standard capture
        if (absDc === 1 && dr === dir && target && target.color !== piece.color) {
          return true;
        }
        return false;
      }

      case 'r': {
        if (dr !== 0 && dc !== 0) return false;
        const stepR = dr === 0 ? 0 : dr / absDr;
        const stepC = dc === 0 ? 0 : dc / absDc;
        let currR = fromR + stepR;
        let currC = fromC + stepC;
        while (currR !== toR || currC !== toC) {
          if (currentBoard[currR][currC] !== null) return false; // Path blocked
          currR += stepR;
          currC += stepC;
        }
        return true;
      }

      case 'b': {
        if (absDr !== absDc) return false;
        const stepR = dr / absDr;
        const stepC = dc / absDc;
        let currR = fromR + stepR;
        let currC = fromC + stepC;
        while (currR !== toR || currC !== toC) {
          if (currentBoard[currR][currC] !== null) return false; // Path blocked
          currR += stepR;
          currC += stepC;
        }
        return true;
      }

      case 'n': {
        return (absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2);
      }

      case 'q': {
        if (dr === 0 || dc === 0) {
          const stepR = dr === 0 ? 0 : dr / absDr;
          const stepC = dc === 0 ? 0 : dc / absDc;
          let currR = fromR + stepR;
          let currC = fromC + stepC;
          while (currR !== toR || currC !== toC) {
            if (currentBoard[currR][currC] !== null) return false;
            currR += stepR;
            currC += stepC;
          }
          return true;
        } else if (absDr === absDc) {
          const stepR = dr / absDr;
          const stepC = dc / absDc;
          let currR = fromR + stepR;
          let currC = fromC + stepC;
          while (currR !== toR || currC !== toC) {
            if (currentBoard[currR][currC] !== null) return false;
            currR += stepR;
            currC += stepC;
          }
          return true;
        }
        return false;
      }

      case 'k': {
        return absDr <= 1 && absDc <= 1;
      }
    }
    return false;
  };

  // Find the position of the King
  const findKing = (color: PieceColor, tempBoard: Board): Position | null => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = tempBoard[r][c];
        if (piece && piece.type === 'k' && piece.color === color) {
          return { r, c };
        }
      }
    }
    return null;
  };

  // Check if a King is currently in Check
  const isKingInCheck = (color: PieceColor, tempBoard: Board): boolean => {
    const kingPos = findKing(color, tempBoard);
    if (!kingPos) return false;

    // Is there any opponent piece that can legally attack the King's square?
    const opponentColor = color === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = tempBoard[r][c];
        if (piece && piece.color === opponentColor) {
          if (isValidMoveBasic(r, c, kingPos.r, kingPos.c, tempBoard)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Strictly check REAL chess rules (Geometric check + "does move put own King in check?")
  const isMoveLegal = (from: Position, to: Position, currentBoard: Board): boolean => {
    if (!isValidMoveBasic(from.r, from.c, to.r, to.c, currentBoard)) return false;

    const movingPiece = currentBoard[from.r][from.c];
    if (!movingPiece) return false;

    // Simulate the move temporarily
    const nextBoard = currentBoard.map(row => [...row]);
    nextBoard[to.r][to.c] = movingPiece;
    nextBoard[from.r][from.c] = null;

    // Move is illegal if it places or leaves your own king in check!
    return !isKingInCheck(movingPiece.color, nextBoard);
  };

  // Generate all legal moves for a given piece position (respecting Pins and King safety)
  const getLegalMoves = (r: number, c: number, currentBoard: Board): Position[] => {
    const moves: Position[] = [];
    const piece = currentBoard[r][c];
    if (!piece) return [];

    for (let targetR = 0; targetR < 8; targetR++) {
      for (let targetC = 0; targetC < 8; targetC++) {
        if (isMoveLegal({ r, c }, { r: targetR, c: targetC }, currentBoard)) {
          moves.push({ r: targetR, c: targetC });
        }
      }
    }
    return moves;
  };

  interface FullMove {
    from: Position;
    to: Position;
    score: number;
  }

  // Generate ALL legal moves for a specific player color
  const getAllLegalMovesForColor = (color: PieceColor, currentBoard: Board): FullMove[] => {
    const allMoves: FullMove[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = currentBoard[r][c];
        if (piece && piece.color === color) {
          const validDests = getLegalMoves(r, c, currentBoard);
          validDests.forEach(dest => {
            allMoves.push({
              from: { r, c },
              to: dest,
              score: 0
            });
          });
        }
      }
    }
    return allMoves;
  };

  // Evaluate board static strength (MiniMax score heuristic from Black/AI's perspective)
  const evaluateBoard = (currentBoard: Board): number => {
    const PIECE_VALUES: Record<PieceType, number> = {
      p: 10,
      n: 32,
      b: 33,
      r: 50,
      q: 90,
      k: 99999
    };

    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = currentBoard[r][c];
        if (piece) {
          let val = PIECE_VALUES[piece.type];

          // Positional weights: Prefer central square control
          if (piece.type === 'n' || piece.type === 'b') {
            if (r >= 2 && r <= 5 && c >= 2 && c <= 5) {
              val += 4;
            }
          }
          // Pawns get slightly stronger as they advance
          if (piece.type === 'p') {
            val += piece.color === 'b' ? r : (7 - r);
          }

          if (piece.color === 'b') {
            score += val;
          } else {
            score -= val;
          }
        }
      }
    }
    return score;
  };

  // Hard MiniMax Algorithm with Alpha-Beta Pruning (Depth 2 - incredibly smart & responsive)
  const minimax = (
    currentBoard: Board,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number => {
    if (depth === 0) {
      return evaluateBoard(currentBoard);
    }

    const activeColor: PieceColor = isMaximizing ? 'b' : 'w';
    const moves = getAllLegalMovesForColor(activeColor, currentBoard);

    if (moves.length === 0) {
      // Is King in check? If yes, it's checkmate. Otherwise, stalemate (draw).
      if (isKingInCheck(activeColor, currentBoard)) {
        return isMaximizing ? -900000 + depth : 900000 - depth;
      }
      return 0; // Stalemate
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const nextBoard = currentBoard.map(row => [...row]);
        nextBoard[move.to.r][move.to.c] = nextBoard[move.from.r][move.from.c];
        nextBoard[move.from.r][move.from.c] = null;

        // Auto-promote pawns in simulation
        if (nextBoard[move.to.r][move.to.c]?.type === 'p' && move.to.r === 7) {
          nextBoard[move.to.r][move.to.c] = { type: 'q', color: 'b' };
        }

        const evaluation = minimax(nextBoard, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const nextBoard = currentBoard.map(row => [...row]);
        nextBoard[move.to.r][move.to.c] = nextBoard[move.from.r][move.from.c];
        nextBoard[move.from.r][move.from.c] = null;

        // Auto-promote pawns in simulation
        if (nextBoard[move.to.r][move.to.c]?.type === 'p' && move.to.r === 0) {
          nextBoard[move.to.r][move.to.c] = { type: 'q', color: 'w' };
        }

        const evaluation = minimax(nextBoard, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Pruning
      }
      return minEval;
    }
  };

  // AI Turn Logic trigger
  useEffect(() => {
    if (turn === 'b' && gameStatus === 'playing') {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        makeAiMove();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [turn, gameStatus]);

  // AI Decision Engine using Hard Alpha-Beta Minimax
  const makeAiMove = () => {
    const aiMoves = getAllLegalMovesForColor('b', board);

    if (aiMoves.length === 0) {
      if (isKingInCheck('b', board)) {
        setGameStatus('win_w'); // Player wins by checkmate!
        if (audioEnabled && onPlayWinSound) onPlayWinSound();
      } else {
        setGameStatus('draw'); // Stalemate
      }
      setIsAiThinking(false);
      return;
    }

    let bestScore = -Infinity;
    let bestMoves: FullMove[] = [];

    aiMoves.forEach(move => {
      const nextBoard = board.map(row => [...row]);
      nextBoard[move.to.r][move.to.c] = nextBoard[move.from.r][move.from.c];
      nextBoard[move.from.r][move.from.c] = null;

      if (nextBoard[move.to.r][move.to.c]?.type === 'p' && move.to.r === 7) {
        nextBoard[move.to.r][move.to.c] = { type: 'q', color: 'b' };
      }

      // Minimax Depth 2 for ultra-fast, professional grade gameplay response
      const score = minimax(nextBoard, 2, -Infinity, Infinity, false);
      move.score = score;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    });

    if (bestMoves.length === 0) {
      // Fallback
      const randomMove = aiMoves[Math.floor(Math.random() * aiMoves.length)];
      executeMove(randomMove.from, randomMove.to);
    } else {
      // Pick randomly among equal top scorers to add variety
      const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      executeMove(selectedMove.from, selectedMove.to);
    }
    setIsAiThinking(false);
  };

  // Execute actual move, promote pawns to queens, log history, and check game over
  const executeMove = (from: Position, to: Position) => {
    const movingPiece = board[from.r][from.c];
    if (!movingPiece) return;

    const targetPiece = board[to.r][to.c];
    const isCapture = targetPiece !== null;

    const nextBoard = board.map(row => [...row]);
    nextBoard[to.r][to.c] = movingPiece;
    nextBoard[from.r][from.c] = null;

    // Promotion
    if (movingPiece.type === 'p' && (to.r === 0 || to.r === 7)) {
      nextBoard[to.r][to.c] = { type: 'q', color: movingPiece.color };
    }

    if (audioEnabled) {
      if (isCapture && onPlayCaptureSound) {
        onPlayCaptureSound();
      } else if (onPlayMoveSound) {
        onPlayMoveSound();
      }
    }

    const moveStr = getChessNotation(movingPiece, from, to, isCapture);
    setMoveHistory(prev => [...prev, `${movingPiece.color === 'w' ? '👤' : '🤖'} ${moveStr}`]);

    // Check if player or AI won by checkmate (checking if opponent has any legal moves left)
    const nextColor = movingPiece.color === 'w' ? 'b' : 'w';
    const opponentMoves = getAllLegalMovesForColor(nextColor, nextBoard);

    setBoard(nextBoard);
    setSelectedSquare(null);
    setValidMoves([]);

    if (opponentMoves.length === 0) {
      if (isKingInCheck(nextColor, nextBoard)) {
        if (movingPiece.color === 'w') {
          setGameStatus('win_w');
          if (audioEnabled && onPlayWinSound) onPlayWinSound();
        } else {
          setGameStatus('win_b');
        }
      } else {
        setGameStatus('draw');
      }
      return;
    }

    // Standard switch turn
    setTurn(nextColor);
  };

  const getChessNotation = (piece: Piece, from: Position, to: Position, isCapture: boolean) => {
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const pName = piece.type === 'p' ? '' : piece.type.toUpperCase();
    const capSign = isCapture ? 'x' : '';
    return `${pName}${cols[from.c]}${rows[from.r]}${capSign}${cols[to.c]}${rows[to.r]}`;
  };

  const handleSquareClick = (r: number, c: number) => {
    if (gameStatus !== 'playing' || turn !== 'w' || isAiThinking) return;

    const clickedPiece = board[r][c];

    if (selectedSquare) {
      const isDestinationValid = validMoves.some(m => m.r === r && m.c === c);
      if (isDestinationValid) {
        executeMove(selectedSquare, { r, c });
        return;
      }
    }

    if (clickedPiece && clickedPiece.color === 'w') {
      setSelectedSquare({ r, c });
      const moves = getLegalMoves(r, c, board);
      setValidMoves(moves);
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  // Track captured pieces dynamically
  const getCapturedPieces = (): { w: PieceType[]; b: PieceType[] } => {
    const initialCounts: Record<PieceColor, Record<PieceType, number>> = {
      w: { p: 8, r: 2, n: 2, b: 2, q: 1, k: 1 },
      b: { p: 8, r: 2, n: 2, b: 2, q: 1, k: 1 }
    };

    const currentCounts: Record<PieceColor, Record<PieceType, number>> = {
      w: { p: 0, r: 0, n: 0, b: 0, q: 0, k: 0 },
      b: { p: 0, r: 0, n: 0, b: 0, q: 0, k: 0 }
    };

    board.forEach(row => {
      row.forEach(piece => {
        if (piece) {
          currentCounts[piece.color][piece.type]++;
        }
      });
    });

    const captured: { w: PieceType[]; b: PieceType[] } = { w: [], b: [] };

    // White pieces captured by black (AI):
    for (const typeStr in initialCounts.w) {
      const type = typeStr as PieceType;
      const diff = initialCounts.w[type] - currentCounts.w[type];
      for (let i = 0; i < diff; i++) {
        captured.w.push(type);
      }
    }

    // Black pieces captured by white (Player):
    for (const typeStr in initialCounts.b) {
      const type = typeStr as PieceType;
      const diff = initialCounts.b[type] - currentCounts.b[type];
      for (let i = 0; i < diff; i++) {
        captured.b.push(type);
      }
    }

    return captured;
  };

  const handleReset = () => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setSelectedSquare(null);
    setValidMoves([]);
    setTurn('w');
    setGameStatus('playing');
    setMoveHistory([]);
    setIsAiThinking(false);
    if (timeLimit !== null) {
      setWhiteTime(timeLimit);
      setBlackTime(timeLimit);
    }
  };

  const handleSelectTimeFormat = (minutes: number) => {
    setTimeLimit(minutes * 60);
    setWhiteTime(minutes * 60);
    setBlackTime(minutes * 60);
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setTurn('w');
    setGameStatus('playing');
    setMoveHistory([]);
    setIsAiThinking(false);
  };

  const captured = getCapturedPieces();

  // If match format is not chosen yet
  if (timeLimit === null) {
    return (
      <div className="flex flex-col items-center justify-center max-w-lg w-full mx-auto bg-slate-900/98 border border-amber-500/30 p-10 rounded-3xl shadow-2xl text-slate-100 font-sans select-none text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
        <Cpu className="w-16 h-16 text-amber-400 mb-4 animate-bounce" />
        <h3 className="text-2xl font-extrabold tracking-tight text-white mb-2 font-sans">Grandmaster Chess Pavilion</h3>
        <span className="text-[10px] tracking-widest font-mono text-amber-400 uppercase font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6 inline-block">TACTICAL AI DEEP BLUE</span>
        <p className="text-xs text-slate-300 max-w-sm mb-8 leading-relaxed">
          Welcome to the Chess Pavilion! Sit down and test your tactical depth against our resident Grandmaster AI, powered by a 2-Ply Alpha-Beta Pruned minimax search engine with custom spatial evaluation.
        </p>

        <div className="flex flex-col gap-4 w-full mb-8">
          <button
            onClick={() => handleSelectTimeFormat(5)}
            className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-amber-900/40 to-amber-850/20 hover:from-amber-500 hover:to-amber-600 border border-amber-500/30 hover:border-amber-400 active:scale-98 transition-all group"
          >
            <div className="text-left">
              <span className="block text-sm font-extrabold text-white group-hover:text-amber-950">5 Minutes Blitz</span>
              <span className="block text-[10px] text-slate-400 group-hover:text-amber-900">High pressure tactical showdown</span>
            </div>
            <span className="text-xs font-mono bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/20 text-amber-400 group-hover:bg-amber-950 group-hover:text-white">05:00</span>
          </button>

          <button
            onClick={() => handleSelectTimeFormat(10)}
            className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-amber-500 hover:to-amber-600 border border-slate-700/60 hover:border-amber-400 active:scale-98 transition-all group"
          >
            <div className="text-left">
              <span className="block text-sm font-extrabold text-white group-hover:text-amber-950">10 Minutes Rapid</span>
              <span className="block text-[10px] text-slate-400 group-hover:text-amber-900">Strategic depth and calculated execution</span>
            </div>
            <span className="text-xs font-mono bg-slate-950 px-3 py-1 rounded-full border border-slate-700 text-slate-300 group-hover:bg-amber-950 group-hover:text-white">10:00</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs transition-all border border-slate-700/50"
        >
          Nevermind, Stand Up
        </button>
      </div>
    );
  }

  const whiteKingChecked = isKingInCheck('w', board);
  const blackKingChecked = isKingInCheck('b', board);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl w-full text-slate-100 p-4 font-sans select-none bg-slate-900/98 rounded-3xl border border-amber-500/20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-600" />

      {/* CHESS BOARD & PLAYER HUD AREA */}
      <div className="flex-1 flex flex-col items-center">
        {/* Opponent HUD */}
        <div className="w-full max-w-[540px] xl:max-w-[620px] bg-slate-950 px-4 py-3 rounded-t-2xl border-t border-x border-slate-800 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Cpu className={`w-5 h-5 text-amber-400 ${isAiThinking ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <span className="block text-xs font-extrabold tracking-wider uppercase text-amber-400">Tactical AI Engine</span>
              <div className="flex gap-1 text-[9px] text-slate-400">
                <span>Depth: 2-Ply minimax</span>
                <span>•</span>
                <span>Active evaluation</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Captured white pieces */}
            <div className="flex items-center gap-0.5 px-2 py-1 rounded bg-slate-900 border border-slate-800/40">
              {captured.w.length > 0 ? (
                captured.w.map((type, idx) => (
                  <ChessPiece key={idx} color="w" type={type} sizeClass="w-5 h-5" />
                ))
              ) : (
                <span className="text-[8px] text-slate-600 font-sans tracking-tight uppercase">Perfect</span>
              )}
            </div>

            <span className={`text-sm font-mono font-bold px-3 py-1 rounded-lg ${turn === 'b' && gameStatus === 'playing' ? 'bg-amber-500 text-slate-950 animate-pulse font-extrabold' : 'bg-slate-900 text-slate-400'}`}>
              {formatTime(blackTime)}
            </span>
          </div>
        </div>

        {/* Board */}
        <div className="w-full max-w-[540px] xl:max-w-[620px] aspect-square bg-slate-950 p-4 border-x border-b border-slate-800 shadow-2xl rounded-b-2xl relative">
          
          {/* Visual Indicators for Checks */}
          {whiteKingChecked && gameStatus === 'playing' && (
            <div className="absolute inset-x-0 top-1 text-center z-10">
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-lg border border-red-400 animate-bounce">
                ⚠️ YOUR KING IS IN CHECK!
              </span>
            </div>
          )}
          {blackKingChecked && gameStatus === 'playing' && (
            <div className="absolute inset-x-0 top-1 text-center z-10">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-lg border border-amber-300 animate-pulse">
                ⚡ AI KING IS IN CHECK!
              </span>
            </div>
          )}

          <div className="grid grid-cols-8 grid-rows-8 h-full w-full rounded-xl overflow-hidden border-2 border-amber-500/20 shadow-inner bg-slate-900">
            {board.map((row, rIdx) =>
              row.map((piece, cIdx) => {
                const isSelected = selectedSquare?.r === rIdx && selectedSquare?.c === cIdx;
                const isValidDest = validMoves.some(m => m.r === rIdx && m.c === cIdx);
                const isDarkSquare = (rIdx + cIdx) % 2 === 1;

                // Luxury Classic Wood/Marble color pallet
                let squareBg = isDarkSquare ? 'bg-[#5d4037]' : 'bg-[#d7ccc8]'; // Deep walnut and light oak
                
                // Active indicators
                if (isSelected) {
                  squareBg = 'bg-yellow-400/90 shadow-lg scale-98 z-10 border border-yellow-300';
                } else if (isValidDest) {
                  squareBg = isDarkSquare ? 'bg-amber-850/80 hover:bg-amber-800/90' : 'bg-amber-300 hover:bg-amber-400';
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handleSquareClick(rIdx, cIdx)}
                    className={`${squareBg} relative flex items-center justify-center cursor-pointer transition-all duration-150 select-none aspect-square group border border-slate-900/10`}
                  >
                    {/* Legal Move indicator dot */}
                    {isValidDest && !piece && (
                      <div className="absolute w-3.5 h-3.5 bg-amber-500/70 rounded-full animate-pulse border border-white/20 pointer-events-none" />
                    )}

                    {/* Captured/Interactive Target marker */}
                    {isValidDest && piece && (
                      <div className="absolute inset-0 border-2 border-red-500/80 rounded-full scale-90 animate-pulse pointer-events-none" />
                    )}

                    {/* Render Chess Pieces */}
                    {piece && (
                      <ChessPiece color={piece.color} type={piece.type} />
                    )}

                    {/* Rank indices on leftmost column */}
                    {cIdx === 0 && (
                      <span className="absolute top-1 left-1.5 text-[8px] font-bold opacity-40 select-none pointer-events-none text-slate-800">
                        {8 - rIdx}
                      </span>
                    )}
                    {/* File letters on bottommost row */}
                    {rIdx === 7 && (
                      <span className="absolute bottom-1 right-1.5 text-[8px] font-bold opacity-40 select-none pointer-events-none text-slate-800">
                        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][cIdx]}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Player HUD */}
        <div className="w-full max-w-[540px] xl:max-w-[620px] bg-slate-950 mt-4 px-4 py-3 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-200">You (White)</span>
              <span className="block text-[9px] text-slate-400">Matches: Classical rules</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Captured black pieces */}
            <div className="flex items-center gap-0.5 px-2 py-1 rounded bg-slate-900 border border-slate-800/40">
              {captured.b.length > 0 ? (
                captured.b.map((type, idx) => (
                  <ChessPiece key={idx} color="b" type={type} sizeClass="w-5 h-5" />
                ))
              ) : (
                <span className="text-[8px] text-slate-600 font-sans tracking-tight uppercase">Perfect</span>
              )}
            </div>

            <span className={`text-sm font-mono font-bold px-3 py-1 rounded-lg ${turn === 'w' && gameStatus === 'playing' ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md' : 'bg-slate-900 text-slate-400'}`}>
              {formatTime(whiteTime)}
            </span>
          </div>
        </div>
      </div>

      {/* GAME STATUS & LIVE CONTROLS PANEL */}
      <div className="w-full lg:w-72 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">Match Console</h4>
            <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full font-extrabold uppercase animate-pulse">
              LIVE
            </span>
          </div>

          {/* Current Game State */}
          <div className="mt-5">
            {gameStatus === 'playing' ? (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Active Status</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {turn === 'w' ? "⚡ Your turn! Plan your offensive and make a move." : "⌛ Wait, the AI is calculating its next defensive counter..."}
                </p>
              </div>
            ) : gameStatus === 'win_w' ? (
              <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/30 flex flex-col items-center text-center shadow-lg shadow-emerald-950/40">
                <Trophy className="w-10 h-10 text-yellow-400 animate-bounce mb-2" />
                <h5 className="text-sm font-extrabold text-emerald-300">Absolute Victory!</h5>
                <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                  You out-thought the Grandmaster Chess AI in a brilliant demonstration of tactical calculation!
                </p>
              </div>
            ) : gameStatus === 'win_b' ? (
              <div className="bg-red-950/50 p-4 rounded-xl border border-red-500/30 flex flex-col items-center text-center shadow-lg shadow-red-950/40">
                <ShieldAlert className="w-10 h-10 text-red-400 animate-pulse mb-2" />
                <h5 className="text-sm font-extrabold text-red-300">Defeat</h5>
                <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                  The Chess Master AI outmaneuvered you. Restart to take back your throne!
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <h5 className="text-xs font-bold text-slate-300">Draw / Stalemate</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Classic draw. No legal moves left.</p>
              </div>
            )}
          </div>

          {/* HISTORY LOGS */}
          <div className="mt-5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Action Log</label>
            <div className="bg-slate-900/80 h-[210px] rounded-xl p-3 border border-slate-800 font-mono text-xs overflow-y-auto flex flex-col gap-1 text-slate-300">
              {moveHistory.length === 0 ? (
                <span className="text-slate-600 italic text-[10px] font-sans leading-relaxed">No actions logged yet. Interact with white pieces on the oak-brown board to initiate.</span>
              ) : (
                moveHistory.map((m, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-950/60 pb-1.5 last:border-b-0 last:pb-0">
                    <span className="text-amber-500/95 font-bold">Move {idx + 1}</span>
                    <span className="font-mono text-[11px] text-slate-200">{m}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Buttons */}
        <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 active:scale-95 transition-all text-xs font-bold font-sans text-slate-200 hover:text-white border border-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Board
          </button>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-95 transition-all text-xs font-bold font-sans text-slate-950 shadow-lg shadow-amber-950/30"
          >
            <Check className="w-3.5 h-3.5 text-slate-950" />
            Resume Walk
          </button>
        </div>
      </div>
    </div>
  );
}
