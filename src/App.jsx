import { useEffect, useState } from 'react'
import './App.css'

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const EMPTY_BOARD = Array(9).fill(null)

function findWinningLine(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line }
    }
  }
  return null
}

function App() {
  const [board, setBoard] = useState(EMPTY_BOARD)
  const [xQueue, setXQueue] = useState([])
  const [oQueue, setOQueue] = useState([])
  const [activePlayer, setActivePlayer] = useState('X')
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState([])
  const [scores, setScores] = useState({ X: 0, O: 0 })
  const [showRematchCue, setShowRematchCue] = useState(false)

  useEffect(() => {
    if (!winner) {
      return undefined
    }

    let rematchCueTimeout
    const resetTimeout = window.setTimeout(() => {
      setBoard([...EMPTY_BOARD])
      setXQueue([])
      setOQueue([])
      setActivePlayer('X')
      setWinner(null)
      setWinningLine([])
      setShowRematchCue(true)
      rematchCueTimeout = window.setTimeout(() => {
        setShowRematchCue(false)
      }, 1000)
    }, 900)

    return () => {
      window.clearTimeout(resetTimeout)
      window.clearTimeout(rematchCueTimeout)
    }
  }, [winner])

  const handleSquarePress = (squareIndex) => {
    if (winner || board[squareIndex]) {
      return
    }

    setShowRematchCue(false)

    const nextBoard = [...board]
    const nextXQueue = [...xQueue]
    const nextOQueue = [...oQueue]

    if (activePlayer === 'X') {
      if (nextXQueue.length === 3) {
        const oldestX = nextXQueue.shift()
        nextBoard[oldestX] = null
      }
      nextXQueue.push(squareIndex)
      nextBoard[squareIndex] = 'X'
    } else {
      if (nextOQueue.length === 3) {
        const oldestO = nextOQueue.shift()
        nextBoard[oldestO] = null
      }
      nextOQueue.push(squareIndex)
      nextBoard[squareIndex] = 'O'
    }

    const result = findWinningLine(nextBoard)

    setBoard(nextBoard)
    setXQueue(nextXQueue)
    setOQueue(nextOQueue)

    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setScores((currentScores) => ({
        ...currentScores,
        [result.winner]: currentScores[result.winner] + 1,
      }))
      return
    }

    setActivePlayer((current) => (current === 'X' ? 'O' : 'X'))
  }

  const resetScores = () => {
    setScores({ X: 0, O: 0 })
  }

  return (
    <main className="app">
      <section className="game-shell" aria-label="Infinite Tic-Tac-Toe board">
        <header className="status-strip" aria-live="polite">
          <p className="turn-status">
            <span
              className={`turn-dot ${winner ? `is-${winner.toLowerCase()}` : `is-${activePlayer.toLowerCase()}`}`}
              aria-hidden="true"
            />
            {winner ? `${winner} wins` : `${activePlayer} to move`}
          </p>
          <p className="score-text">X: {scores.X} | O: {scores.O}</p>
        </header>

        <div className="board" role="grid">
          {board.map((value, squareIndex) => (
            <button
              key={squareIndex}
              type="button"
              role="gridcell"
              className={`square ${winningLine.includes(squareIndex) ? 'win' : ''}`}
              onClick={() => handleSquarePress(squareIndex)}
              disabled={Boolean(winner) || Boolean(value)}
              aria-label={`Square ${squareIndex + 1}${value ? ` occupied by ${value}` : ''}`}
            >
              {value && <span className={`piece piece-${value.toLowerCase()}`}>{value}</span>}
            </button>
          ))}
        </div>

        <p className={`rematch-cue ${showRematchCue ? 'visible' : ''}`} aria-live="polite">
          Tap to start next round
        </p>

        <button type="button" className="reset-button" onClick={resetScores}>
          Reset Scores
        </button>
      </section>
    </main>
  )
}

export default App
