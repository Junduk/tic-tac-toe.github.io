import Songs from './Songs.js'

const collaborations = new Array();
const listOfArtists = new Array();
for(let i of Songs){
    for(let j in i.artists){
        if(j == 0 && listOfArtists.indexOf(i.artists[j]) == -1){
            listOfArtists.push(i.artists[j]);
            collaborations.push({'name': i.artists[j], 'features': new Array()});
        } else if(j != 0 && collaborations[listOfArtists.length - 1].features.indexOf(i.artists[j]) == -1){
            collaborations[listOfArtists.length - 1].features.push(i.artists[j]);
        }
    }
}

export default collaborations;
