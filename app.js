require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {spotifyApi.setAccessToken(data.body['access_token']) 
     console.log(data)} )
    .catch(error => console.log('Something went wrong when retrieving an access token', error))
// Our routes go here:
app.get('/', (require,response)=>{
    response.render('homePage')
})
app.get('/artist-search', (request,response)=>{
    spotifyApi
  .searchArtists(request.query.searchTerm)
  .then(data => {
    let artists=data.body.artists.items
    console.log('The received data from the API: ',JSON.stringify(artists))
    response.render('searchResult', {data})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
    

})
app.get('/albums/:id', (request,response)=>{
    spotifyApi
  .getArtistAlbums(request.params.id)
  .then(data => {
    let albums=data.body
    console.log('The received data from the API: ',JSON.stringify(albums))
    response.render('albums', {albums})
    //response.send('display album')
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
    

})
app.get('/tracks/:id', (request,response)=>{
    spotifyApi
  .getAlbumTracks(request.params.id)
  .then(data => {
    let tracks=data.body
    console.log('The received data from the API: ',JSON.stringify(tracks))
    response.render('tracks', {tracks})
    //response.send('display album')
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
    

})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
