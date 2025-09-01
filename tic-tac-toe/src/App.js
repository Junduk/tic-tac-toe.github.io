import './App.css';
import { useEffect, useState } from 'react';
import Songs from './GeniusSongs.js'
import collaborations from './CollaborationsPerArtist.js';

const App = () => {

  let songsSet = [];
  const [result, setResult] = useState('...');
  const [categories, setCategories] = useState(["Eminem", '', '', '', '', '']);
  const [searchInput, setSearchInput] = useState([]);
  const [restartDisabled, setRestartDisabled] = useState(true);
  const [generateDisabled, setGenerateDisabled] = useState(false);
  const [cell, setCell] = useState([-1, -1]);
  //const [bools, setBools] = useState([false, false, false, false, false, false, false, false, false]);
  const [bools, setBools] = useState([false, false, false, false, false, false, false, false, false]);
  const [turn, setTurn] = useState('Player 1');
  const [possibleWins, setPossibleWins] = useState([[0, 1, 2], [0, 4, 8], [0, 3, 6], [2, 4, 6], [2, 5, 8], [3, 4, 5], [6, 7, 8], [1, 4, 7]]);

  const handleChange = (event) => {
    const matchingSongs = [];
    if (event.target.value.length > 2) {
      Songs.filter((song) => {
        if (song.title.toLowerCase().match(event.target.value.toLowerCase())) {
          matchingSongs.push(song.title);
        }
      });
      setSearchInput([...new Set(matchingSongs)]);
    } else {
      setSearchInput([]);
    }
  };

  const changePlayer = () => {
    if (turn == 'Player 1') {
      setTurn('Player 2');
    } else {
      setTurn('Player 1');
    }
  }

  useEffect(() => {
    checkPossibleWin();
  }, [turn]);

  const checkPossibleWin = () => {
    console.log(bools)
    let counter = 0;
    for (let sign of bools) {
      if (sign != false) {
        counter++;
      }
    }
    if (counter > 2 && counter <= 9) {
      for (let i = 0; i < possibleWins.length; i++) {
        if (bools[possibleWins[i][0]] == bools[possibleWins[i][1]] && bools[possibleWins[i][1]] == bools[possibleWins[i][2]] && bools[possibleWins[i][0]] != false) {
          console.log("t")
          return finishGame(true, turn == "Player 1" ? 1 : 2);
        }
      }
    }
    if (counter == 9) {
      finishGame(false, 0);
    }
  }

  const finishGame = (win, player) => {
    setRestartDisabled(false);
    setGenerateDisabled(true);
    if (win) {
      setTurn(`Player ${player} won! Click button "Restart" to enjoy another game.`);
    } else {
      setTurn(`It's a draw! Click button "Restart to enjoy another game.`);
    }
  }

  const restartTheTable = () => {
    turn == 'Player 1' ? setTurn('Player 2') : setTurn('Player 1');
    setRestartDisabled(true);
    setGenerateDisabled(false);
    for (let i = 1; i <= 9; i++) {
      document.getElementById(`field${i}`).innerHTML = "";
      document.getElementById(`field${i}`).style.pointerEvents = "initial";
    }
    document.getElementsByClassName("input1")[0].value = "";
    document.getElementsByClassName("input1")[0].placeholder = "Enter a name:";
    setSearchInput([]);
    setBools([false, false, false, false, false, false, false, false, false]);
  }

  const generateArtists = () => {
    const numOfArtists = collaborations.length - 1;
    let randomNum1 = Math.round(Math.random() * numOfArtists);
    let randomNum2 = Math.round(Math.random() * numOfArtists);
    while (randomNum2 == randomNum1) {
      randomNum2 = Math.round(Math.random() * numOfArtists);
    }
    let randomNum3 = Math.round(Math.random() * numOfArtists);
    while (randomNum3 == randomNum1 || randomNum3 == randomNum2) {
      randomNum3 = Math.round(Math.random() * numOfArtists);
    }
    let list2 = [];
    let list3 = [];
    for (let features1 of collaborations[randomNum1].features) {
      if (collaborations[randomNum2].features.includes(features1)) {
        list2.push(features1);
      }
    }
    for (let features2 of collaborations[randomNum3].features) {
      if (list2.includes(features2)) {
        list3.push(features2);
      }
    }

    if (list3.length < 3) {
      generateArtists();
    } else {
      let randomNum4 = Math.round(Math.random() * (list3.length - 1));
      let randomNum5 = Math.round(Math.random() * (list3.length - 1));
      while (randomNum5 == randomNum4) {
        randomNum5 = Math.round(Math.random() * (list3.length - 1));
      }
      let randomNum6 = Math.round(Math.random() * (list3.length - 1));
      while (randomNum6 == randomNum4 || randomNum6 == randomNum5) {
        randomNum6 = Math.round(Math.random() * (list3.length - 1));
      }
      list3 = [collaborations[randomNum1].name, collaborations[randomNum2].name, collaborations[randomNum3].name, list3[randomNum4], list3[randomNum5], list3[randomNum6]];
      setCategories(list3);
      restartTheTable()
    }
  }
  //testirati kad se ubaci jedan predefinisan pick za artist
  //azurirati Songs.js sa jos vise pjevaca


  const getArtistSongs = (artistID, page, perPage, sort) => {
    let songs = [];
    fetch('http://localhost:5000/genius/artist/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `https://api.genius.com/artists/${artistID}/songs?page=${page}&per_page=${perPage}&sort=${sort}`,
        method: 'GET',
        headers: {
          Authorization: ''
        }
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        //console.log(data);
        for (let i of data.response.songs) {
          let features = [];
          if (i.primary_artists.length > 0) {
            for (let j of i.primary_artists) {
              features.push(j.name);
            }
          }
          if (i.featured_artists.length > 0) {
            for (let j of i.featured_artists) {
              features.push(j.name);
            }
          }
          songs.push({ title: `${i.title}`, artists: features });
          //for printing
          let text = "{ title: `" + i.title + "`, artists: [";
          for(let j in features){
            if(j == features.length - 1){
              text += "`" + features[j] + "`";
            } else {
              text += "`" + features[j] + "` ,";
            }
          }
          text += '] },';
          songsSet.push(text);
          //for printing
        }
      })
      .then(() => {
        //console.log(songs);
        console.log('Finished');
        return songs;
      })
      .catch((error) => {
        console.error('Error fetching songs:', error);
      });
  }

  const getArtist = (artistID) => {
    fetch('http://localhost:5000/genius/artist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `https://api.genius.com/artists/${artistID}`,
        method: 'GET',
        headers: {
          Authorization: ''
        }
      })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.response.artist.id + " " + data.response.artist.name);
        songsSet.push('//' + data.response.artist.id + " " + data.response.artist.name);
        return data.response.artist;
      })
      .catch((error) => {
        console.error('Error fetching songs:', error);
      });
  }

  const getInfo1 = () => {
    songsSet = [];
    let artistID = 500;
    let page = 1;
    const perPage = 50; //max 50
    const sort = 'popularity';
    // for (let i = 0; i <= 400; i++) {
    //   getArtist(artistID);
    //   artistID++;
    // }
    for(let i = 0; i <= 4; i++){
      getArtistSongs(artistID, page, perPage, sort);
      page++;
    }
  }

  const printInfo = () => {
    songsSet.sort();
    for (let i of songsSet) {
      console.log(i);
    }
  }

  //1 Cam'ron
  //2 JAY-Z
  //3 Fabolous
  //4 Lil Wayne
  //5 Clipse
  //13 Gucci Mane
  //18 Big Tymers
  //20 Ghostface Killah
  //21 Wu-Tang Clan
  //22 The Notorious B.I.G.
  //32 Ol' Dirty Bastard
  //34 Jadakiss
  //38 Juvenile
  //42 The Game
  //44 Three 6 Mafia
  //45 Eminem
  //46 Snoop dogg
  //56 Nas
  //58 Cormega
  //59 2Pac
  //63 Fatlip
  //64 Bone Thugs-N-Harmony
  //67 Jeezy
  //68 Kid Cudi
  //69 J. Cole
  //70 MF DOOM
  //72 Kanye West
  //73 Jamie Foxx
  //74 Twista
  //75 Styles P
  //76 Raekwon
  //77 DMX
  //78 Juelz Santana
  //79 Jim Jones
  //80 The Diplomats
  //81 AZ
  //82 Diddy
  //83 Fat Joe
  //85 T.I.
  //86 Birdman
  //88 Rick Ross
  //89 Rihanna
  //92 Nicki Minaj
  //93 Jaheim
  //96 Sandman
  //97 Liva
  //100 Pete Rock
  //101 Shatasha Williams
  //103 Big L
  //104 Pill
  //105 OutKast
  //107 Lil Jon
  //108 50 Cent
  //110 Pharrell Williams
  //111 Ludacris
  //112 Timbaland
  //115 Chamillionaire
  //116 Heene Boyz
  //117 Trina
  //118 Yo Gotti
  //119 Beanie Sigel
  //122 Prodigy
  //123 Dr. Dre
  //124 Das Racist
  //126 Rakim
  //127 Scarface
  //128 Billy Cook
  //129 Junior M.A.F.I.A.
  //130 Drake
  //132 USHER
  //133 East Side Boyz
  //134 Trillville
  //135 Lil Scrappy
  //136 Elementary
  //139 Skee-Lo
  //140 Khia
  //142 Master P
  //144 Kelis
  //146 Mannie Fresh
  //147 Lupe Fiasco
  //148 Nelly
  //149 Nate Dogg
  //150 Madvillain
  //156 Yasiin Bey
  //157 Akon
  //158 DJ Khaled
  //160 Mack Maine
  //161 Big Pun
  //162 Sean Price
  //164 Mo Money
  //166 Crunchy Black
  //167 Project Pat
  //169 Warren G
  //170 Kurupt
  //173 Slaughterhouse
  //176 Black Thought
  //177 Bilal
  //178 Aesop Rock
  //179 Joe Budden
  //180 Outlawz
  //181 Bob Dylan
  //182 Yelawolf
  //183 Ja Rule
  //184 Swizz Beatz
  //186 Ice Cube
  //187 Tom Tom Club
  //190 Mystikal
  //191 Too $hort
  //192 M.O.P.
  //193 Paul Cain
  //195 Memphis Bleek
  //196 Lloyd
  //197 Young Money
  //198 Jay Electronica
  //201 Sauce Money
  //202 Big Daddy Kane
  //203 Public Enemy
  //204 Foxy Brown
  //206 Jae Millz
  //207 Stack Bundles
  //208 Angela Winbush
  //209 Canibus
  //210 Das EFX
  //211 Red Cafe
  //212 Disposable Heroes of Hiphoprisy
  //213 Saul Williams
  //214 Lyrics Born
  //215 Blackalicious
  //216 AMG
  //217 DJ Quik
  //219 Guru
  //220 Gang Starr
  //221 Jean Grae
  //223 Common
  //224 J Dilla
  //225 De La Soul
  //226 Flavor Flav
  //228 Method Man
  //229 Redman
  //230 Cassidy
  //232 Black Rob
  //233 The LOX
  //235 The Coup
  //236 dead prez
  //237 Reef
  //238 Immortal Technique
  //240 Reflection Eternal
  //242 The Dramatics
  //243 Maimouna Youssef
  //244 The Roots
  //245 Sheek Louch
  //249 Ma$e
  //250 Freeway
  //251 Mobb Deep
  //255 Lloyd Banks
  //257 Waka Flocka Flame
  //260 OJ da Juiceman
  //262 Joell Ortiz
  //266 Everlast
  //267 Q-Tip
  //268 Black Sheep
  //269 Vampire Weekend
  //270 Gudda Gudda
  //272 Plies
  //273 Eye-Kyu
  //276 Madonna
  //278 Jeremih
  //282 Mario
  //286 Slim Thug
  //287 Mike Jones
  //288 Bun B
  //289 Paul Wall
  //291 Xzibit
  //293 Yung Ralph
  //294 Pauly Yams
  //295 DJ Jazzy Jeff
  //296 J.R. Writer
  //298 Hayley Williams
  //300 40 Cal
  //301 DJ Drama
  //303 D12   /////////////////
  //304 Rich Boy
  //305 Jeru the Damaja
  //306 Slick Rick
  //307 RZA
  //308 Naughty By Nature
  //310 Wiz Khalifa
  //311 Insane Clown Posse
  //312 Boo
  //313 Sugarhill Gang
  //315 Lady Wray
  //316 Dice Raw
  //318 Big Boi
  //319 Vinnie Paz
  //320 R.A. The Rugged Man
  //322 Willie the Kid
  //323 Dxtroit Red
  //325 Novel
  //326 Trey Songz
  //327 ​eLZhi
  //328 J-Hood
  //329 Beastie Boys
  //330 Special Ed
  //332 Empire of the Sun
  //334 Justin Timberlake ///////////
  //335 Ron Browz
  //337 T-Pain
  //338 Busta Rhymes
  //339 Mýa
  //340 Pras
  //342 Eric B.
  //343 GLC
  //344 Consequence
  //345 P!nk
  //346 Mr. Lif
  //347 Grandmaster Flash & The Furious Five
  //349 Cory Gunz
  //350 Krayzie Bone
  //351 George Clinton
  //353 Chris Martin
  //354 Black Star
  //355 Kobe
  //356 Dina Rae
  //357 Justin Bieber /////////////
  //358 Mary J. Blige
  //359 YoungBlood​Z
  //361 Sway
  //362 Alicia Keys
  //364 Monsters of Folk
  //365 John Legend
  //366 Klashnekoff
  //367 Masta Ace
  //368 The Streets
  //369 Isaac Hayes
  //372 Fugees
  //373 Terror Squad
  //375 Ne-Yo /////////////
  //377 Geto Boys
  //379 Trick Daddy
  //381 Cody ChesnuTT
  //382 Lil’ Flip
  //383 David Banner
  //385 Atmosphere
  //387 Above the Law
  //388 Talib Kweli
  //390 Mickey Factz
  //391 MC Shan
  //392 Snow
  //393 Shawna
  //395 Jay Sean
  //396 Wale
  //397 Skillz
  //399 Mr Hudson
  //401 UGK
  //402 Young Buck
  //403 N.O.R.E.
  //404 WC
  //405 E-40
  //406 Young Dro
  //408 Mims
  //409 Charles Hamilton
  //411 Lil’ Kim
  //412 I-20
  //413 Chiddy Bang
  //415 Bobby V
  //416 Devin the Dude
  //420 Blu
  //421 Naledge
  //422 6th Sense
  //424 Papa Roach
  //425 Black Eyed Peas ///////////
  //426 Army of the Pharaohs
  //429 Danny Boy
  //430 Lord Finesse
  //432 Chris Webby
  //435 Dido
  //436 Ray J
  //437 Bobby Brackins
  //438 Chris Brown
  //440 Boyz II Men
  //442 Scribe
  //443 P Money
  //444 Afu-Ra
  //446 Miguel
  //447 Lady Gaga
  //448 Lauryn Hill
  //449 GemStones
  //450 Celph Titled
  //451 RJD2
  //452 Diverse
  //453 Asher Roth
  //455 Lil B
  //456 Y-Not
  //457 Diamond D
  //458 Eve
  //459 Robin Thicke
  //460 Ace Hood
  //462 Stretch
  //463 Goldie Loc
  //464 Tha Dogg Pound
  //466 Apathy
  //467 Wyclef Jean
  //469 Jewell
  //470 Tre Little
  //471 Royce Da 5'9"
  //472 Lowkey
  //473 Ying Yang Twins
  //474 Lil Jon & The East Side Boyz
  //475 Pac Div
  //476 Matthew Santos
  //477 Soul Position
  //478 The Firm
  //480 The Beatnuts
  //481 K’naan
  //484 KXNG Crooked
  //485 Luniz
  //486 Bushwick Bill
  //487 Chino XL
  //488 John Mayer
  //490 Uncle Murda
  //491 Big K.R.I.T.
  //492 Big Sean
  //493 Seventh Floor Crew
  //494 Dresta
  //495 B.G. Knocc Out
  //496 Eazy-E
  //497 Brisco
  //498 Beyoncé
  //500 Bruno Mars ////////
  //501 Sage Francis
  //502 Non-Prophets
  //503 EPMD
  //504 112
  //505 Yukmouth
  //506 Tech N9ne
  //507 GZA
  //508 Inspectah Deck
  //509 Denaun
  //512 Jedi Mind Tricks
  //513 Yan the Phenomenon
  //515 Jus Allah
  //517 The Last Emperor
  //519 A Tribe Called Quest
  //520 Camp Lo
  //521 The Pharcyde
  //522 Souls of Mischief
  //523 Dre
  //524 Slick Pulla
  //525 Blood Raw
  //526 Dru Down
  //527 Shock G
  //528 Richie Rich
  //529 Spice 1
  //530 Charlie Wilson
  //531 Substantial
  //532 Tonedeff
  //533 Aerosmith
  //534 CunninLynguists
  //535 R. Kelly
  //536 Nick Cannon
  //537 Johnny P
  //538 Chrisette Michele
  //539 McGruff
  //541 Bloodshed
  //542 Ruste Juxx
  //544 Blue Scholars
  //545 MC Paul Barman
  //546 Loaded Lux
  //547 Killer Mike
  //553 Lil Twist
  //554 Tyga
  //555 Ca$his
  //556 Tony Yayo
  //557 Henele Wright
  //560 Elton John
  //561 Eagles
  //562 Led Zeppelin
  //563 Queen
  //566 Fre$h (Short Dawg)
  //567 MC Jin
  //568 Sterling Simms
  //569 Ultimate Force
  //570 Freck Billionaire
  //571 MC Chris
  //572 UNKLE
  //573 Ingrid Smalls
  //574 Jimmy Spicer
  //575 Terra
  //577 Buddah Bless
  //578 Big Twan
  //579 Killa Kam
  //580 Trooper J
  //581 Mike Boogie
  //582 Truck North
  //583 Saigon
  //584 Chali 2NA
  //585 Roots Manuva
  //586 The Beatles
  //587 Sarah Green
  //588 Z-Ro
  //589 Bon Iver
  //593 Ricco Barrino
  //594 Child Rebel Soldier
  //597 Brandon Flowers
  //598 Neil Young
  //599 The Killers
  //600 Arcade Fire
  //601 The Doors
  //602 Tanya Herron
  //603 Antoine Dodson
  //604 Radiohead
  //605 Murs
  //606 Keak da Sneak
  //609 Edward Maya
  //610 Vika Jigulina
  //612 Radio Killer
  //614 Yung Joc
  //617 Black Milk
  //619 The Doobie Brothers
  //620 ID
  //621 Infamous Delinquents
  //622 Cali Swag District
  //627 The Lady of Rage
  //628 Pitbull //////////////
  //629 Leonard Cohen
  //630 Rivers Cuomo
  //631 Blind Melon
  //632 Green Day
  //633 DOM KENNEDY
  //635 Pebbles the Invisible Girl
  //637 Guns N’ Roses
  //638 Stalley
  //640 King Los
  //641 Lynyrd Skynyrd
  //642 Tash (Tha Alkaholiks)
  //643 Pusha T
  //644 Animal Collective
  //645 Chingy
  //646 Murphy Lee
  //648 The Clash
  //649 D-Lo
  //650 John
  //651 Mac Dre
  //652 Niia
  //653 Fiona Apple
  //654 Mike Posner
  //655 Kenn Starr
  //656 Sir Mix-a-Lot
  //657 Rappin’ 4-Tay
  //658 The National
  //659 Sublime
  //660 Prince
  //661 Daniel Merriweather
  //662 Boi-1da
  //663 Nina Sky
  //664 Ricky Blaze
  //665 Major Lazer
  //667 Travie McCoy
  //668 Digital Underground
  //669 Adam Levine
  //670 Bandido (Pop)
  //671 Melanie Fiona
  //675 Deltron 3030
  //676 Coolio
  //679 Sting
  //680 Craig David
  //682 Faith Evans
  //684 Pharoahe Monch
  //685 Tyler, The Creator
  //686 Earl Sweatshirt
  //688 Slum Village
  //691 Sade
  //693 J-Black
  //694 Pink Floyd
  //695 Hittman
  //697 Lucid Dreams
  //698 Kevin McCall
  //699 Ryan Leslie
  //703 Foster the People
  //704 Fort Minor
  //706 T-Streets
  //708 King Geedorah
  //709 Gk
  //711 Misfits
  //712 Viktor Vaughn
  //713 will.i.am
  //715 Harlem Shakes
  //717 Emily Dickinson
  //718 The Stop the Violence Movement
  //719 Cappadonna
  //720 Labrinth
  //721 Tinie Tempah
  //722 e. e. cummings
  //723 Blur
  //724 Locksmith
  //725 Dylan Thomas
  //726 William Butler Yeats
  //727 Nikki Giovanni
  //729 John Berryman
  //730 Fashawn
  //731 Omen
  //732 Craig Smith
  //733 Nesto
  //736 Diggy
  //737 Bloodhound Gang
  //738 D.M.C.
  //739 Rumi
  //740 Sean Paul
  //742 T.S. Eliot
  //743 deadmau5
  //744 Morgan Page
  //745 Bow Wow
  //746 Jimi Hendrix
  //747 N.E.R.D.
  //748 Goodie Mob
  //749 The White Stripes
  //750 All City Chess Club
  //751 Big Rube
  //754 Nino Bless
  //755 Flobots
  //757 Wayne Wonder
  //758 CyHi
  //759 Keri Hilson
  //760 Jupiter (Band)
  //762 Avery Storm
  //763 Phoenix
  //764 MGMT
  //765 Ramones
  //768 Various Artists
  //769 Larceny
  //771 Lock
  //772 Rockstar
  //773 Virtuoso
  //774 The Rolling Stones
  //777 Samuel Taylor Coleridge
  //778 Robert Frost
  //779 Andrew Marvell
  //780 Vado
  //782 Keyshia Cole
  //783 Janelle Monáe
  //785 Gravediggaz
  //788 The Minks
  //790 Butch Cassidy
  //793 Lost Boyz
  //794 Scoob
  //795 Shyheim
  //797 Ruckus Roboticus
  //798 Adam WarRock
  //799 Rap Genius Editors
  //800 Bee Gees
  //803 Kurtis Blow
  //805 Miley Cyrus
  //806 Doris Day
  //807 Mighty Casey
  //808 Trife
  //809 2 Live Crew
  //810 Obie Trice
  //811 La Roux
  //812 Rhymefest
  //813 J. Phoenix
  //814 Andre Nickatina
  //815 Boogie Down Productions
  //816 Ginuwine
  //818 Miss Jones
  //819 Stan Spit
  //820 Mac Miller
  //822 William Blake
  //823 Milli Vanilli
  //824 Frank Sinatra
  //827 Moses, Prophet
  //828 Ricky Martin
  //829 Eurythmics
  //831 Fat Trel
  //832 Black Cobain
  //835 Michael Jackson
  //842 William Shakespeare
  //843 U.T.P
  //844 Monie Love
  //845 Craig G
  //846 Marley Marl
  //847 Kool G Rap
  //848 LL COOL J
  //849 Glasses Malone
  //850 Styles of Beyond
  //851 Unk
  //852 Peter Fox
  //853 B.o.B
  //854 The West Coast Rap All Stars
  //859 Gorilla Zoe
  //860 Gorillaz
  //861 The Crooklyn Dodgers
  //862 Dee Money
  //863 Shop Boyz
  //864 Curtis Mayfield
  //869 Jagged Edge
  //872 Psycho Drama
  //874 Tim Dog
  //875 Young Cash
  //882 Kidd Kidd
  //884 Demarco
  //885 Vybz Kartel
  //886 Tarrus Riley
  //887 The Kinks
  //888 MUTEMATH
  //889 GodAWFUL
  //891 The Allen Jokers
  //897 Spose
  //899 “Weird Al” Yankovic
  //901 Amil
  //904 Mecca
  //909 Erykah Badu
  //921 Joseph Torres
  //922 Bob Marley
  //924 Far East Movement
  //926 William Carlos Williams
  //928 Girl Talk
  //929 Webbie
  //930 Foxx-a-million
  //931 Boosie Badazz
  //933 Sean Kingston
  //934 OneRepublic
  //936 Kardinal Offishall
  //937 Flynt Flossy
  //938 Yung Humma
  //939 Freddie Gibbs
  //940 The Lonely Island
  //941 Vince Staples
  //942 House of Pain
  //943 Depeche Mode
  //944 Marvin Gaye
  //946 Killah Priest
  //947 Samuel Menashe
  //950 Fergie
  //951 The World Famous Tony Williams
  //952 Amiri Baraka
  //953 Gil Scott-Heron
  //956 Eric Turner
  //957 CYNE
  //958 Sufjan Stevens
  //959 Drastic
  //960 Nesby Phips
  //961 Elly Jackson
  //964 TLC
  //969 Jasmine Mans
  //971 The High & Mighty
  //972 King Skam
  //974 N.W.A
  //976 Stat Quo
  //977 Masta Killa
  //978 Shuffle T
  //979 Bo Burnham
  //980 B.J. Thomas
  //986 Dwele
  //987 Mela Machinko
  //988 Shawnna
  //989 Joni Mitchell
  //992 Bishop G
  //993 Nikki Jean
  //994 Gripz
  //995 Invincible
  //998 B-Real
  //1000 Abeer
  //1001 Natasha Bedingfield
  //1002 David Milch
  //1003 Robert Penn Warren
  //1004 Wallace Stevens
  //1005 Nadia Ackerman
  //1006 Soul Khan
  //1007 DJ Clue
  //1008 Pastor Troy
  //1010 XV
  //1012 Del the Funky Homosapien
  //1013 Playboy Tre
  //1014 Bishop Lamont
  //1015 Chester Bennington
  //1016 Swedish House Mafia
  //1018 Lil Cuete
  //1020 Jhené Aiko
  //1021 Phonte
  //1022 Evidence
  //1023 Paris (Rap)
  //1024 Chubb Rock
  //1025 Tone
  //1026 MC Serch
  //1029 Philip Larkin
  //1032 Sway & King Tech
  //1034 Blue Raspberry
  //1035 ​k-os
  //1037 The Cataracs
  //1038 Dev
  //1039 MC Hammer
  //1040 Big Prime Da General
  //1042 M.I.A.
  //1043 Bizarre
  //1045 Binary Star
  //1049 James Madison
  //1050 Loon
  //1051 Mario Winans
  //1052 Britney Spears
  //1053 Jungle (Rap)
  //1054 Akinyele
  //1056 Large Professor
  //1057 Tank
  //1058 Lil Phat
  //1060 U-God


  const getInfo2 = () => {
    const query = 'Eminem';
    const type = 'artists';
    const offset = 0;
    const limit = 10000;
    const numberOfTopResults = 5;
    const id = "0QHgL1lAIqAw0HtD7YldmP";
    if (result) {
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
          for (let i = 0; i < data.data.artist.relatedContent.appearsOn.items.length; i++) {
            console.log(data.data.artist.relatedContent.appearsOn.items[i].releases.items[0].artists.items[0].profile.name);
          }
        });
    }
  }


  const guessArtist = (title) => {
    const row = cell[0];
    const column = cell[1];
    loop1:
    for (let i = 0; i < 10; i++) {
      if (bools[i] == "picked") {
        for (let j = 0; j < Songs.length; j++) {
          if (Songs[j].title === title) {
            if (Songs[j].artists.indexOf(document.getElementById(`row${row}`).innerHTML) != -1 && Songs[j].artists.indexOf(document.getElementById(`column${column}`).innerHTML) != -1) {
              document.getElementById(`field${i + 1}`).innerHTML = turn == 'Player 1' ? "O" : "X";
              document.getElementById(`field${i + 1}`).style.pointerEvents = "none";
              console.log(bools.map((bool, index) => bool = index == i ? turn : bool))
              setBools(bools.map((bool, index) => bool = index == i ? turn : bool));
              document.getElementsByClassName("input1")[0].value = "";
              document.getElementsByClassName("input1")[0].placeholder = "Enter a name:";
              changePlayer();
              break loop1;
            }
          }
        }
        document.getElementsByClassName("input1")[0].value = "";
        document.getElementsByClassName("input1")[0].placeholder = "Incorrect. Try again:";
        setBools(bools.map((bool) => { return bool == "picked" ? false : bool }));
        changePlayer();
        break loop1;
      } else if (typeof bools[i] === 'undefined') {
        document.getElementsByClassName("input1")[0].value = "";
        document.getElementsByClassName("input1")[0].placeholder = "Enter a name:";
        alert("Click one cell first.");
      }
    }
    setSearchInput([]);
  }

  const chooseCell = (num, row, column) => {
    const list = bools.map((bool) => { return bool == "picked" ? false : bool });
    for (let cellSignIndex in list) {
      if (cellSignIndex == num) {
        list[cellSignIndex] = "picked";
      }
    }
    console.log("List: " + list);
    setBools(list);
    setCell([row, column]);
    document.getElementsByClassName("input1")[0].focus();
  }

  const changeShadowOn = () => {
    const elements = document.getElementsByClassName('game-cell');
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add('shadowAnimStop');
    }
  }

  const changeShadowOff = () => {
    const elements = document.getElementsByClassName('game-cell');
    for (let i = 0; i < elements.length; i++) {
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
        <div id="field1" className={`game-cell shadowOn ${bools[0] == "picked" ? "clicked" : "four"}`} onClick={() => chooseCell(0, 1, 1)}>O</div>
        <div id="field2" className={`game-cell shadowOn ${bools[1] == "picked" ? "clicked" : "three"}`} onClick={() => chooseCell(1, 1, 2)}>O</div>
        <div id="field3" className={`game-cell shadowOn ${bools[2] == "picked" ? "clicked" : "four"}`} onClick={() => chooseCell(2, 1, 3)}></div>
        <div id="row2" className='game-cell shadowOn two'></div>
        <div id="field4" className={`game-cell shadowOn ${bools[3] == "picked" ? "clicked" : "three"}`} onClick={() => chooseCell(3, 2, 1)}></div>
        <div id="field5" className={`game-cell shadowOn ${bools[4] == "picked" ? "clicked" : "four"}`} onClick={() => chooseCell(4, 2, 2)}></div>
        <div id="field6" className={`game-cell shadowOn ${bools[5] == "picked" ? "clicked" : "three"}`} onClick={() => chooseCell(5, 2, 3)}></div>
        <div id="row3" className='game-cell shadowOn two'></div>
        <div id="field7" className={`game-cell shadowOn ${bools[6] == "picked" ? "clicked" : "four"}`} onClick={() => chooseCell(6, 3, 1)}></div>
        <div id="field8" className={`game-cell shadowOn ${bools[7] == "picked" ? "clicked" : "three"}`} onClick={() => chooseCell(7, 3, 2)}></div>
        <div id="field9" className={`game-cell shadowOn ${bools[8] == "picked" ? "clicked" : "four"}`} onClick={() => chooseCell(8, 3, 3)}></div>
      </div>
      <button className='button' onClick={generateArtists} disabled={generateDisabled}>Generate Artists</button>
      <button className='button' onClick={restartTheTable} disabled={restartDisabled}>Restart</button>
      <button className='button' onClick={getInfo1}>Get Info</button>
      <button className='button' onClick={printInfo}>Print Info</button>
      <p className='player'>{turn}</p>
      <input className="input1" list="browsers" type="search" placeholder="Enter a name:" onChange={handleChange} />
      <div className='guessList'>{searchInput.map((x, i) => <div className="item" onClick={() => guessArtist(x)} key={i}>{x}</div>)}</div>
    </div>
  );
}

export default App;