import './App.css';
import { useEffect, useState } from 'react';
import Data from './Data.js'
import Songs from './Songs.js'

const App = () => {

  const [result, setResult] = useState('...');
  const [categories, setCategories] = useState(["first", "second", "third", "forth", "fifth", "sixth"]);
  const [searchInput, setSearchInput] = useState([]);
  const [cell, setCell] = useState([-1, -1]);
  const [bools, setBools] = useState([false, false, false, false, false, false, false, false, false]);
  const [turn, setTurn] = useState(false);
  const songs = Songs;

  const handleChange = (event) => {
    const matchingSongs = [];
    if(event.target.value.length > 2) {
      songs.filter((song) => {
        if(song.title.toLowerCase().match(event.target.value.toLowerCase())){
          matchingSongs.push(song.title);
        }
      });
      setSearchInput([...new Set(matchingSongs)]);
    } else {
      setSearchInput([]);
    }
  };

  const generateArtists = () => {
    const list2 = [Data[0].name, Data[13].name, Data[2].name];
    for(let i = 0; i < Data.length; i++){
      if(!list2.includes(Data[i].name)){
        if(Data[0].features.includes(Data[i].name) && Data[13].features.includes(Data[i].name) && Data[2].features.includes(Data[i].name)){
          list2.push(Data[i].name);
          if(list2.length === 6){
            break;
          }
        }
      }
    }
    setCategories(list2);
  }

  const getInfo2 = () => {
    const query = 'Eminem';
    const type = 'artists';
    const offset = 0;
    const limit = 10000;
    const numberOfTopResults = 5;
    const id = "0QHgL1lAIqAw0HtD7YldmP";
    if(result){
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'bfb9dc32cfmsh6dd78ddfa1d5083p1f3ab6jsn5da044b816ec',
          'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
      };
      let relatedArtists = '';
      fetch(`https://spotify23.p.rapidapi.com/artist_appears_on/?id=${id}`, options)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          for(let i = 0; i < data.data.artist.relatedContent.appearsOn.items.length; i++){
            console.log(data.data.artist.relatedContent.appearsOn.items[i].releases.items[0].artists.items[0].profile.name);
          }
          
      });
    }
  }


  const guessArtist = (title) => {
    const row = cell[0];
    const column = cell[1];
    loop1:
    for(let i = 0; i < 10; i++) {
      if(bools[i] === true){
        for(let j = 0; j < Songs.length; j++){
          if(Songs[j].title === title){
            if(Songs[j].artists.match(document.getElementById(`row${row}`).innerHTML) && Songs[j].artists.match(document.getElementById(`column${column}`).innerHTML)){
              document.getElementById(`field${i+1}`).innerHTML = turn ? "O" : "X";
              document.getElementById(`field${i+1}`).style.pointerEvents = "none";
              setTurn(!turn);
              document.getElementsByClassName("input1")[0].value = "";
              document.getElementsByClassName("input1")[0].placeholder = "Enter a name:";
              break loop1;
            }
          }
        }
        document.getElementsByClassName("input1")[0].value = "";
        document.getElementsByClassName("input1")[0].placeholder = "Incorrect. Try again:";
        break loop1;
      } else if(typeof bools[i] === 'undefined'){
        alert("Click one cell first.");
      }
    }
    setBools([false, false, false, false, false, false, false, false, false]);
    setSearchInput([]);
  }

  const chooseCell = (num, row, column) => {
    const list = [false, false, false, false, false, false, false, false, false];
    list[num] = true;
    setBools(list);
    setCell([row, column]);
  }

  const changeShadowOn = () => {
    const elements = document.getElementsByClassName('game-cell');
    for(let i = 0; i < elements.length; i++){
      elements[i].classList.add('shadowAnimStop');
    }
  }

  const changeShadowOff = () => {
    const elements = document.getElementsByClassName('game-cell');
    for(let i = 0; i < elements.length; i++){
      elements[i].classList.remove('shadowAnimStop');
    }
  }

  useEffect(() => {
    const row1 = document.getElementById("row1");
    const row2 = document.getElementById("row2");
    const row3 = document.getElementById("row3");
    const column1 = document.getElementById("column1");
    const column2 = document.getElementById("column2");
    const column3 = document.getElementById("column3");
    row1.innerHTML = categories[0];
    row2.innerHTML = categories[1];
    row3.innerHTML = categories[2];
    column1.innerHTML = categories[3];
    column2.innerHTML = categories[4];
    column3.innerHTML = categories[5];
  }, categories);
  
  return (
    <div className='background'>
      <div className='grid grow' onMouseOver={changeShadowOn} onMouseLeave={changeShadowOff}>
        <div id="logo_field" className='game-cell shadowOn one'></div>
        <div id="column1" className='game-cell shadowOn two'></div>
        <div id="column2" className='game-cell shadowOn two'></div>
        <div id="column3" className='game-cell shadowOn two'></div>
        <div id="row1" className='game-cell shadowOn two'></div>
        <div id="field1" className={`game-cell shadowOn ${bools[0] ? "clicked" : "four"}`} onClick={() => chooseCell(0, 1, 1)}></div>
        <div id="field2" className={`game-cell shadowOn ${bools[1] ? "clicked" : "three"}`} onClick={() => chooseCell(1, 1, 2)}></div>
        <div id="field3" className={`game-cell shadowOn ${bools[2] ? "clicked" : "four"}`} onClick={() => chooseCell(2, 1, 3)}></div>
        <div id="row2" className='game-cell shadowOn two'></div>
        <div id="field4" className={`game-cell shadowOn ${bools[3] ? "clicked" : "three"}`} onClick={() => chooseCell(3, 2, 1)}></div>
        <div id="field5" className={`game-cell shadowOn ${bools[4] ? "clicked" : "four"}`} onClick={() => chooseCell(4, 2, 2)}></div>
        <div id="field6" className={`game-cell shadowOn ${bools[5] ? "clicked" : "three"}`} onClick={() => chooseCell(5, 2, 3)}></div>
        <div id="row3" className='game-cell shadowOn two'></div>
        <div id="field7" className={`game-cell shadowOn ${bools[6] ? "clicked" : "four"}`} onClick={() => chooseCell(6, 3, 1)}></div>
        <div id="field8" className={`game-cell shadowOn ${bools[7] ? "clicked" : "three"}`} onClick={() => chooseCell(7, 3, 2)}></div>
        <div id="field9" className={`game-cell shadowOn ${bools[8] ? "clicked" : "four"}`} onClick={() => chooseCell(8, 3, 3)}></div>
      </div>
      <button className='button' onClick={generateArtists}>Generate Artists</button>
      <button className='button' onClick={getInfo2}>Click2</button>
      <input className="input1" list="browsers" type="search" placeholder="Enter a name:" onChange={handleChange}/>
      <div className='guessList'>{searchInput.map((x, i) => <div className="item" onClick={() => guessArtist(x)} key={i}>{x}</div>)}</div>
    </div>
  );
}

export default App;