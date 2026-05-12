"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const BOARD_W = 10;
const BOARD_H = 20;
const CELL = 20;

type Difficulty = "easy" | "medium" | "hard";

const DROP_INTERVALS: Record<Difficulty, number> = {
  easy: 700,
  medium: 400,
  hard: 180,
};

const COLORS: Record<string, string> = {
  I: "#4DD2FF",
  O: "#FFD700",
  T: "#B388FF",
  S: "#66BB6A",
  Z: "#EF5350",
  J: "#42A5F5",
  L: "#FFA726",
};

const PIECES: { shape: number[][]; name: string }[] = [
  {
    name: "I",
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    name: "O",
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    name: "T",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    name: "S",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  },
  {
    name: "Z",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    name: "J",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    name: "L",
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
];

function rotateCW(shape: number[][]): number[][] {
  const n = shape.length;
  const rotated: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      rotated[c][n - 1 - r] = shape[r][c];
  return rotated;
}

function randomPiece() {
  return PIECES[Math.floor(Math.random() * PIECES.length)];
}

type Screen = "start" | "playing" | "gameover";

interface EmptyStatePetProps {
  onExit?: () => void;
}

export default function EmptyStatePet({ onExit }: EmptyStatePetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<string[][]>([]);
  const pieceRef = useRef<{
    shape: number[][];
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const nextRef = useRef<{ shape: number[][]; name: string } | null>(null);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const dropTimerRef = useRef(0);
  const difficultyRef = useRef<Difficulty>("medium");
  const screenRef = useRef<Screen>("start");

  const lockPieceRef = useRef<() => void>(() => {});

  const [screen, setScreen] = useState<Screen>("start");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  const initBoard = useCallback(() => {
    boardRef.current = Array.from({ length: BOARD_H }, () =>
      Array(BOARD_W).fill(""),
    );
  }, []);

  const spawnPiece = useCallback(() => {
    const piece = nextRef.current || randomPiece();
    nextRef.current = randomPiece();
    const shape = piece.shape.map((r) => [...r]);
    pieceRef.current = {
      shape,
      name: piece.name,
      x: Math.floor((BOARD_W - shape[0].length) / 2),
      y: 0,
    };
    if (collides(pieceRef.current.shape, pieceRef.current.x, pieceRef.current.y)) {
      setScreen("gameover");
    }
  }, []);

  function collides(shape: number[][], px: number, py: number): boolean {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const bx = px + c;
        const by = py + r;
        if (bx < 0 || bx >= BOARD_W || by >= BOARD_H) return true;
        if (by < 0) continue;
        if (boardRef.current[by]?.[bx]) return true;
      }
    }
    return false;
  }

  function lockPiece() {
    const p = pieceRef.current;
    if (!p) return;
    for (let r = 0; r < p.shape.length; r++) {
      for (let c = 0; c < p.shape[r].length; c++) {
        if (!p.shape[r][c]) continue;
        const bx = p.x + c;
        const by = p.y + r;
        if (by >= 0 && by < BOARD_H && bx >= 0 && bx < BOARD_W) {
          boardRef.current[by][bx] = p.name;
        }
      }
    }
    clearLines();
    spawnPiece();
  }

  function clearLines() {
    let cleared = 0;
    for (let r = BOARD_H - 1; r >= 0; r--) {
      if (boardRef.current[r].every((c) => c !== "")) {
        boardRef.current.splice(r, 1);
        boardRef.current.unshift(Array(BOARD_W).fill(""));
        cleared++;
        r++;
      }
    }
    if (cleared > 0) {
      const points = [0, 100, 300, 500, 800];
      const add = points[Math.min(cleared, 4)];
      scoreRef.current += add;
      linesRef.current += cleared;
    }
  }

  // Keep lockPieceRef in sync
  lockPieceRef.current = lockPiece;

  // Reset
  const startGame = useCallback(() => {
    initBoard();
    scoreRef.current = 0;
    linesRef.current = 0;
    dropTimerRef.current = 0;
    nextRef.current = randomPiece();
    spawnPiece();
    setScreen("playing");
  }, [initBoard, spawnPiece]);



  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (screenRef.current === "playing") {
        dropTimerRef.current += 16;
        const interval = DROP_INTERVALS[difficultyRef.current];
        if (dropTimerRef.current >= interval) {
          dropTimerRef.current = 0;
          const p = pieceRef.current;
          if (p) {
            if (!collides(p.shape, p.x, p.y + 1)) {
              p.y++;
            } else {
              lockPieceRef.current();
            }
          }
        }
      }

      // === RENDER ===
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, w, h);

      const boardPixelW = BOARD_W * CELL;
      const boardPixelH = BOARD_H * CELL;
      const offsetX = 12;
      const offsetY = 12;

      // Board background
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(offsetX, offsetY, boardPixelW, boardPixelH);
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 1;
      ctx.strokeRect(offsetX, offsetY, boardPixelW, boardPixelH);

      // Grid lines
      ctx.strokeStyle = "#2d3748";
      ctx.lineWidth = 0.5;
      for (let c = 1; c < BOARD_W; c++) {
        const x = offsetX + c * CELL;
        ctx.beginPath();
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, offsetY + boardPixelH);
        ctx.stroke();
      }
      for (let r = 1; r < BOARD_H; r++) {
        const y = offsetY + r * CELL;
        ctx.beginPath();
        ctx.moveTo(offsetX, y);
        ctx.lineTo(offsetX + boardPixelW, y);
        ctx.stroke();
      }

      // Placed pieces
      for (let r = 0; r < BOARD_H; r++) {
        for (let c = 0; c < BOARD_W; c++) {
          const name = boardRef.current[r]?.[c];
          if (!name) continue;
          ctx.fillStyle = COLORS[name] || "#666";
          ctx.fillRect(offsetX + c * CELL + 1, offsetY + r * CELL + 1, CELL - 2, CELL - 2);
          // Highlight
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(offsetX + c * CELL + 1, offsetY + r * CELL + 1, CELL - 2, 3);
        }
      }

      // Ghost piece
      if (screenRef.current === "playing" && pieceRef.current) {
        const p = pieceRef.current;
        let gy = p.y;
        while (!collides(p.shape, p.x, gy + 1)) gy++;
        for (let r = 0; r < p.shape.length; r++) {
          for (let c = 0; c < p.shape[r].length; c++) {
            if (!p.shape[r][c]) continue;
            const bx = p.x + c;
            const by = gy + r;
            if (by < 0) continue;
            ctx.strokeStyle = COLORS[p.name] || "#666";
            ctx.lineWidth = 1;
            ctx.strokeRect(offsetX + bx * CELL + 2, offsetY + by * CELL + 2, CELL - 4, CELL - 4);
          }
        }
      }

      // Current piece
      if (screenRef.current === "playing" && pieceRef.current) {
        const p = pieceRef.current;
        for (let r = 0; r < p.shape.length; r++) {
          for (let c = 0; c < p.shape[r].length; c++) {
            if (!p.shape[r][c]) continue;
            const bx = p.x + c;
            const by = p.y + r;
            if (by < 0) continue;
            ctx.fillStyle = COLORS[p.name] || "#666";
            ctx.fillRect(offsetX + bx * CELL + 1, offsetY + by * CELL + 1, CELL - 2, CELL - 2);
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.fillRect(offsetX + bx * CELL + 1, offsetY + by * CELL + 1, CELL - 2, 3);
          }
        }
      }

      // Side panel
      const sideX = offsetX + boardPixelW + 16;

      // Score
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("SCORE", sideX, 30);
      ctx.fillStyle = "#F9FAFB";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(String(scoreRef.current), sideX, 52);

      // Lines
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "11px sans-serif";
      ctx.fillText("LINES", sideX, 80);
      ctx.fillStyle = "#F9FAFB";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(String(linesRef.current), sideX, 100);

      // Next piece
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "11px sans-serif";
      ctx.fillText("NEXT", sideX, 130);

      if (nextRef.current) {
        const next = nextRef.current;
        const previewCell = 14;
        const previewW = next.shape[0].length * previewCell;
        const previewH = next.shape.length * previewCell;
        const px = sideX;
        const py = 140;
        ctx.fillStyle = "#1f2937";
        ctx.fillRect(px, py, previewW + 8, previewH + 8);
        for (let r = 0; r < next.shape.length; r++) {
          for (let c = 0; c < next.shape[r].length; c++) {
            if (!next.shape[r][c]) continue;
            ctx.fillStyle = COLORS[next.name] || "#666";
            ctx.fillRect(px + 4 + c * previewCell + 1, py + 4 + r * previewCell + 1, previewCell - 2, previewCell - 2);
          }
        }
      }

      // Start screen
      if (screenRef.current === "start") {
        // Button will be rendered by React overlay
      }

      // Game over overlay
      if (screenRef.current === "gameover") {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#EF5350";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", w / 2, h / 2 - 40);

        ctx.fillStyle = "#F9FAFB";
        ctx.font = "16px sans-serif";
        ctx.fillText(`Score: ${scoreRef.current}`, w / 2, h / 2);

        ctx.fillStyle = "#9CA3AF";
        ctx.font = "12px sans-serif";
        ctx.fillText("Press Enter or click to restart", w / 2, h / 2 + 35);
      }

      requestAnimationFrame(loop);
    };

    const raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Canvas resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Keyboard
  useEffect(() => {
    function kMoveLeft() {
      const p = pieceRef.current;
      if (!p || screenRef.current !== "playing") return;
      if (!collides(p.shape, p.x - 1, p.y)) p.x--;
    }

    function kMoveRight() {
      const p = pieceRef.current;
      if (!p || screenRef.current !== "playing") return;
      if (!collides(p.shape, p.x + 1, p.y)) p.x++;
    }

    function kMoveDown() {
      const p = pieceRef.current;
      if (!p || screenRef.current !== "playing") return;
      if (!collides(p.shape, p.x, p.y + 1)) p.y++;
      else lockPieceRef.current();
    }

    function kRotate() {
      const p = pieceRef.current;
      if (!p || screenRef.current !== "playing") return;
      const rotated = rotateCW(p.shape);
      if (!collides(rotated, p.x, p.y)) {
        p.shape = rotated;
      } else {
        for (const offset of [-1, 1, -2, 2]) {
          if (!collides(rotated, p.x + offset, p.y)) {
            p.shape = rotated;
            p.x += offset;
            break;
          }
        }
      }
    }

    function kHardDrop() {
      const p = pieceRef.current;
      if (!p || screenRef.current !== "playing") return;
      while (!collides(p.shape, p.x, p.y + 1)) p.y++;
      lockPieceRef.current();
      dropTimerRef.current = 0;
    }

    const handleKey = (e: KeyboardEvent) => {
      if (screenRef.current === "start" || screenRef.current === "gameover") {
        if (e.key === "Enter") {
          startGame();
          return;
        }
      }
      if (screenRef.current !== "playing") return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          kMoveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          kMoveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          kMoveDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          kRotate();
          break;
        case " ":
          e.preventDefault();
          kHardDrop();
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [startGame]);

  const handleCanvasClick = () => {
    if (screenRef.current === "gameover") {
      startGame();
    }
  };

  const difficulties: { key: Difficulty; label: string }[] = [
    { key: "easy", label: "Easy" },
    { key: "medium", label: "Medium" },
    { key: "hard", label: "Hard" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-h-0 w-full overflow-hidden select-none bg-[#111827]"
    >
      {/* Exit button */}
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white/60 hover:text-white hover:bg-black/60 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}

      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onClick={handleCanvasClick}
      />

      {/* Start screen overlay */}
      {screen === "start" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111827]/90 z-10 gap-4 p-6">
          <h2 className="text-2xl font-bold text-white tracking-wider">
            TETRIS
          </h2>
          <p className="text-xs text-muted-foreground">
            Arrow keys to move &middot; Up to rotate &middot; Space to drop
          </p>
          <div className="flex gap-2 mt-1">
            {difficulties.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setDifficulty(d.key)}
                className={`px-4 py-1.5 text-sm rounded-lg border transition-all ${
                  difficulty === d.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-ring"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={startGame}
            className="mt-2 px-8 py-2.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Game over overlay */}
      {screen === "gameover" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <button
            type="button"
            onClick={startGame}
            className="pointer-events-auto mt-40 px-6 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all opacity-0"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
