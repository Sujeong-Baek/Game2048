import Tile from './tile.js'
import React, { useState, useEffect, useRef } from 'react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceDizzy, faFaceGrinStars } from "@fortawesome/free-solid-svg-icons";

export default function Board() {
  const [boardTiles, setBoardTiles] = useState([
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ]);

  const [score, setScore] = useState(0);  

  function updateTileNumber(tiles) {
    const number = Math.random() < 0.8 ? 2 : 4;
    let r = 0;
    let c = 0;
    do {
        r = Math.floor(Math.random()*4);
        c = Math.floor(Math.random()*4);
    } while (tiles[4*r + c] !== 0);
    const newBoardTiles = [...tiles];
    newBoardTiles[4*r + c] = number;    
    return newBoardTiles;
  }

  function push_right() {
    let isTileMoved = false;
    let newScore = 0;
    let newBoardTiles = [...boardTiles];
  
    for (let row = 0; row < 4; row++) {
      let compare_num = 0;
      let pos = 3;
      for (let col = 3; col >= 0; col--) {
        if (newBoardTiles[4 * row + col] === 0) {
          continue;
        }
        if (compare_num !== newBoardTiles[4 * row + col]) {
          compare_num = newBoardTiles[4 * row + col];
          newBoardTiles[4 * row + col] = 0;
          newBoardTiles[4 * row + pos] = compare_num;
          if (col !== pos) {
            isTileMoved = true;
          }
          pos--;
        } else if (compare_num === newBoardTiles[4 * row + col]) {
          newBoardTiles[4 * row + pos + 1] = compare_num * 2;
          newBoardTiles[4 * row + col] = 0;
          newScore += compare_num * 2;
          compare_num = 0;
          isTileMoved = true;
        }
      }
    }  
    if (isTileMoved) {
      setBoardTiles(updateTileNumber(newBoardTiles));
      setScore(score + newScore);
      setUndoScore(undoScore - newScore);
      checkGameOver();
    }
    return isTileMoved
  }

  function push_left() {
    let isTileMoved = false;
    let newScore = 0;
    let newBoardTiles = [...boardTiles];
    for (let row=0; row<4; row++) {
      let compare_num = 0;
      let pos = 0;
      for (let col = 0; col<4; col++) {
        if (newBoardTiles[4*row + col] === 0) {
          continue;
        }
        if (compare_num !== newBoardTiles[4*row + col]) {
          compare_num = newBoardTiles[4*row + col];
          newBoardTiles[4*row + col] =0;
          newBoardTiles[4*row + pos] =compare_num;
          if (col !== pos) {
            isTileMoved = true;
          }
          pos ++;
        } else if (compare_num === newBoardTiles[4*row + col]){
          newBoardTiles[4*row + pos -1] = compare_num*2;
          newBoardTiles[4*row + col] = 0;
          newScore += compare_num * 2;
          compare_num = 0;
          isTileMoved = true;
        } 
      }
    }
    if (isTileMoved) {
      setBoardTiles(updateTileNumber(newBoardTiles));
      setScore(score+newScore); 
      setUndoScore(undoScore-newScore)
      checkGameOver();   
    }
    return isTileMoved
  }

  function push_down() {
    let isTileMoved = false;
    let newScore = 0;
    let newBoardTiles = [...boardTiles];
    for (let col = 0; col < 4; col++) {
      let compare_num = 0;
      let pos = 3;
      for (let row = 3; row >= 0; row--) {
        if (newBoardTiles[4 * row + col] === 0) {
          continue;
        }
        if (compare_num !== newBoardTiles[4 * row + col]) {
          compare_num = newBoardTiles[4 * row + col];
          newBoardTiles[4 * row + col] = 0;
          newBoardTiles[4 * pos + col] = compare_num;
          if (row !== pos) {
            isTileMoved = true;
          }
          pos--;
        } else if (compare_num === newBoardTiles[4 * row + col]) {
          newBoardTiles[4 * (pos + 1) + col] = compare_num * 2;
          newBoardTiles[4 * row + col] = 0;
          newScore += compare_num * 2;
          compare_num = 0;
          isTileMoved = true;
        }
      }
    }
    if (isTileMoved) {
      setBoardTiles(updateTileNumber(newBoardTiles)); 
      setScore(score + newScore);
      setUndoScore(undoScore - newScore);
      checkGameOver();
    }
    return isTileMoved
  }

  function push_up() {
    let isTileMoved = false;
    let newScore = 0;
    let newBoardTiles = [...boardTiles];
  
    for (let col = 0; col < 4; col++) {
      let compare_num = 0;
      let pos = 0;
      for (let row = 0; row < 4; row++) {
        if (newBoardTiles[4 * row + col] === 0) {
          continue;
        }
        if (compare_num !== newBoardTiles[4 * row + col]) {
          compare_num = newBoardTiles[4 * row + col];
          newBoardTiles[4 * row + col] = 0;
          newBoardTiles[4 * pos + col] = compare_num;
          if (row !== pos) {
            isTileMoved = true;
          }
          pos++;
        } else if (compare_num === newBoardTiles[4 * row + col]) {
          newBoardTiles[4 * (pos - 1) + col] = compare_num * 2;
          newBoardTiles[4 * row + col] = 0;
          newScore += compare_num * 2;
          compare_num = 0;
          isTileMoved = true;
        }
      }
    }  
    if (isTileMoved) {
      setBoardTiles(updateTileNumber(newBoardTiles));
      setScore(score + newScore);
      setUndoScore(undoScore - newScore);
      checkGameOver();
    }
    return isTileMoved
  }

  const [prevBoardTiles, setPrevBoardTiles] = useState([]);

  function handleKeyDown(event) {
    let isMoved = false;    
    if (event.key === "ArrowLeft") {
      isMoved = push_left();
    } else if (event.key === "ArrowRight") {
      isMoved = push_right();
    } else if (event.key === "ArrowUp") {
      isMoved = push_up();  
    } else if (event.key === "ArrowDown") {
      isMoved = push_down();
    }    
    if (isMoved) {
        const newPrevBoardTiles = [...prevBoardTiles, [...boardTiles]];
        if (newPrevBoardTiles.length > 5) {
          newPrevBoardTiles.shift(); 
        }
        setPrevBoardTiles(newPrevBoardTiles)             
    };
  }
  
  function checkFullTiles() {
    if (!boardTiles.includes(0)) { 
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          const index = 4 * row + col;
          if (boardTiles[index] === boardTiles[index + 1]) {
            return false;
          }
        }
      }  
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          const index = 4 * row + col;
          if (boardTiles[index] === boardTiles[index + 4]) {
            return false;
          }
        }
      }
    return true;
    }
  } 

  useEffect(() => {
    checkGameOver();
  }, [boardTiles]);

  const gameOverIcon = (
    <div>
      <FontAwesomeIcon icon={faFaceDizzy} style={{ fontSize: "70px", color: "black" }} />
    </div>
  );  
  const winGameIcon = (
    <div>
      <FontAwesomeIcon icon={faFaceGrinStars} style={{ fontSize: "70px", color: "gold" }} />
    </div>
  );

  function checkGameOver() {
    if (checkFullTiles()) {
      const MySwal = withReactContent(Swal);
      setTimeout(() => {
        MySwal.fire({
          title: "GAME OVER!",
          html: gameOverIcon,
          showCancelButton: true,
          confirmButtonText: "Start a new game!", 
          cancelButtonText: "I'm done.TnT",
        }).then((result) => {
          if (result.value) {
            startNewGame();
          }
        });
      }, 700);
    } else {
      checkWinGame();
    }
  } 

  const [hasWon, setHasWon] = useState(false);

  function checkWinGame() {
    if (hasWon) {
      return;
    }
    if (boardTiles.includes(2048)) {
      setHasWon(true);
      setTimeout(() => {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "You Wwwwwwin!!!",
        html: winGameIcon,
        showCancelButton: true,
        confirmButtonText: "Continue playing!",
        cancelButtonText: "Start a new game!",
      }).then((result) => {
        if (!result.value) {
          startNewGame();
        }
      });
    }, 700);
  }
}
  
  function startNewGame() {
      const tiles = [        
      0, 0, 0, 0,        
      0, 0, 0, 0,        
      0, 0, 0, 0,        
      0, 0, 0, 0,];
      setBoardTiles(updateTileNumber(updateTileNumber(tiles)));
      setScore(0);
      setHasWon(false);
      setUndoCount(0)
      setUndoScore(1000)
      setPrevBoardTiles([])
  }

  const [undoCount, setUndoCount] = useState(0)
  const [undoScore, setUndoScore] = useState(1000);

  useEffect(() => {
    if (undoCount<5 && undoScore<=0) {
      setUndoCount(undoCount + 1);
      setUndoScore(1000+undoScore);
    }
  }, [score]);

  function handleUndo() {
    if (undoCount > 0 && prevBoardTiles.length > 0) {
      const lastBoardState = prevBoardTiles[prevBoardTiles.length - 1];
      setBoardTiles([...lastBoardState]);
      setUndoCount(undoCount - 1);
      setUndoScore(1000);
      setPrevBoardTiles(prevBoardTiles.slice(0, -1));
    }
  }

  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        push_right();
      } else {
        push_left();
      }
    } else {
      if (deltaY > 0) {
        push_down();
      } else {
        push_up();
      }
    }
  };

  const boardFocus = useRef();
  function focusingBoard() {
    boardFocus.current.focus();
  }

  return (
    <div>
      <div className="board-container">
        <div className="game">GAME</div>
        <div className="game-name">2048</div>
        {hasWon && <div className="win-message">YOU WIN!</div>}
        <div className="score-container">
          <div className="score-label">SCORE</div>
          <div className="score-value">{score}</div>
        </div>                         
      </div> 
      <div className="board" ref={boardFocus} onBlur={focusingBoard} onKeyDown={handleKeyDown} tabIndex="0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {boardTiles.map((tile,index) => (
        <Tile number={tile} key={index} />
      ))}
      </div> 
      <div className='button-container'>
        <button className="undo-button" onClick={handleUndo} onFocus={focusingBoard}>          
          <span className='undo-count'>{Array(undoCount).fill("❤️").join("")}</span>
          {undoCount === 0 && <span>Make a heart!!!</span>}
        </button>
        <button className='start-button' onClick={startNewGame} onFocus={focusingBoard}>NEW GAME</button>          
      </div>              
    </div>
    );
  }