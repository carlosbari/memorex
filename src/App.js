import{ useState } from 'react';
import './App.css';


function App() {
  const NUM_INTENTOS = 10;
  const [Tiles, setTiles] = useState([]);
  const [Selected, setSelected] = useState([]);
  const [TurnMoved, setTurnMoved] = useState(0);
  const [GameState, setGameState] = useState('waiting');
  const [Intentos, setIntentos] = useState(NUM_INTENTOS);
  const [Matched, setMatched] = useState(0);


  function shuffleArray(array) {
  // Hacemos una copia del array para no modificar el original directamente,
  // si quieres modificar el original, puedes trabajar directamente sobre 'array'.
  const newArray = [...array]; // o array.slice();

  for (let i = newArray.length - 1; i > 0; i--) {
    // Escogemos un índice aleatorio desde 0 hasta i (incluido)
    const j = Math.floor(Math.random() * (i + 1));

    // Intercambiamos el elemento actual (i) con el elemento del índice aleatorio (j)
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

  function genRand(){
  
    let arr=[]
    for (let i = 0; i < 15; i++) {
      arr[i]=Math.floor(i/2);
      arr[i+1]=Math.floor(i/2);
    }
    // console.log(arr);
    arr=shuffleArray(arr);
    // console.log(arr);
    return arr;
  }
  function onReset(){
    const shuffledInit =genRand();  
    // console.log('shuffledInit:',shuffledInit);
    let tiles=[];
    let tile;
    for (let i = 0; i < 16; i++) {
      tile ={id:i, card:shuffledInit[i],  photo:`https://i.pravatar.cc/48?u=${118836+shuffledInit[i]}`, flipped:true, playing:true};
      tiles.push(tile);
    }
    setTiles(tiles);
    setIntentos(NUM_INTENTOS);
    setMatched(0);
    setGameState('playing');
  }

  function flipAlldown(){
    setTiles((prevTiles)=>
      prevTiles.map((tile)=>
        ({...tile,flipped:true}))
    ); 
  }

  function handleClickTile(id){
    if(GameState==='waiting'||GameState==='loose') return;
    // console.log('id clicked: ',id);
    if(TurnMoved===0){
      console.log('first click')
      setTiles((Tiles)=>
        Tiles.map(tile=>tile.id===id?{...tile, flipped:!tile.flipped}:tile));
      setSelected([id]);
      setTurnMoved((turnMoved)=>turnMoved+1);
            
    }else if(TurnMoved===1){
      console.log('second click')
      setTiles((Tiles)=>
        Tiles.map(tile=>tile.id===id?{...tile, flipped:!tile.flipped}:tile));
      // console.log('se hicieron estos clicks:',Tiles[Selected[0]].card,Tiles[id].card);
      if (Tiles[Selected[0]].card===Tiles[id].card) {
        const hideCard= Tiles[id].card;
        console.log('match')
        setMatched(prevMatched=>prevMatched+1);
        setTimeout(()=>setTiles((prevTiles)=>
          prevTiles.map((tile)=>
            (tile.card===hideCard)?{...tile, playing:false}: tile)),1000);
      }else{
        console.log('no match');
        if(Intentos>0) setTimeout(()=>setIntentos(prevIntentos=>prevIntentos-1),200);
        if(Intentos===1){
          setGameState('loose');
        }
      }
      setTimeout(()=>flipAlldown(),1000);
      setTurnMoved(0);
      
    }
    // console.log(Tiles)
  }


  return (
    <div className={`App ${GameState==='loose'?'Loose':''}`}>
      <header className="App-header">MEMOREX
      </header>
      <div className='Container'>
       <div className='Grilla'>
          {Tiles.map((tile,i)=><Tile tile={tile} i={i} onClickTile={handleClickTile} key={i} game={GameState}/>)}
        </div>
        <div className='Status'>
          <button  onClick={onReset}>Nuevo Juego</button>
          <div>Score: X</div>
          <div>Intentos: {Intentos}</div>
          <div>Matched: {Matched}</div>
          <div>
            <h2>{(GameState==='waiting')?'INICIA EL JUEGO':
                 (GameState==='playing')?'JUGANDO':'FIN DEL JUEGO'}</h2>
          </div>
          <p>Autor: Carlos Caretti</p>
          <p>2025</p>
          <a href='mailto:carloscaretti@gmail.com'>e-mail: carloscaretti@gmail.com</a>

        </div>
      </div>
    </div>
  );
}

function Tile({tile, i, onClickTile, game}){
  return <div className={tile.playing?'':'Hidden'} >
    <img src= {(tile.flipped===true)?'./Pattern 04.jpg': tile.photo}
          className='Cell' alt='tile'  onClick={()=>
          onClickTile(tile.id)}/>
    </div>
  ;
}

export default App;
/*
          className='Cell' alt='tile'  onClick={()=>
          onClickTile(tile.id)}/>

*/