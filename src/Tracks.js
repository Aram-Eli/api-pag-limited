import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const Tracks = () => {

	// Set up states for retrieving access token and top tracks
	const [token, setToken] = useState('');
	const [tracks, setTracks] = useState([]);

	// Artist ID from Spotify
	const id = '06HL4z0CvFAxyc27GXpf02';
	const market = 'US';


	/*
	
	 1- Although there was many option on what to create and what to choose in term of the of functionality I choose to 
	   to use a token of Track from the Spotify API documentation 
	   resource:  https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
      
	   # Librart Used :
	  1- Did Use Axios is a library that serves to create HTTP requests that are present externally

	  2- as Well did use  react-plotly.js to embed D3 charts in your React-powered web application. 
	    This React component takes the chart type, data, and styling as Plotly JSON in its data and layout props, then draws the chart using Plotly.js.
	*/
	
	useEffect(()=>{
         
        // Artist ID from Spotify
	    const id = '0TnOYISbd1XYRBk9myaseg';
	    const market = 'US';

		// Api call for retrieving token
		axios('https://accounts.spotify.com/api/token', {
			'method': 'POST',
			'headers': {
				 'Content-Type':'application/x-www-form-urlencoded',
				 'Authorization': 'Basic ' + (new Buffer('b39749e88fc44479a75c3f401ff8f235' + ':' + '2ae8db5eaa614e1e9cfde323516adc82').toString('base64')),
			},
			data: 'grant_type=client_credentials'
		}).then(tokenresponse => {
            console.log(tokenresponse.data.access_token);
            setToken(tokenresponse.data.access_token);
             
           // Api call for retrieving tracks data
            axios(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`, {
                'method': 'GET',
                'headers': {
                    'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': 'Bearer ' + tokenresponse.data.access_token
                }
            }).then(trackresponse => {
                console.log(trackresponse.data.tracks);
                setTracks(trackresponse.data.tracks);
            }).catch(error => console.log(error));
        }).catch(error => console.log(error))

	},[])

	// Transform track data 
	function PopularityByTrack(data){

		let plotData = [];

		let names = [];
		let popularity = [];

		data.map(each => {
			names.push(each.name);
			popularity.push(each.popularity);
		})

		plotData['names'] = names;
		plotData['popularity'] = popularity;

		return plotData;
	}

	return(
		<div>
			<Plot 
				data={[
					{
						type: 'bar',
						x: PopularityByTrack(tracks)['names'],
						y: PopularityByTrack(tracks)['popularity'],
						marker: {color:'#03fc6b'}
					}
				]}
				layout={{
					width: 1000, 
					height: 600, 
					// title: 'Taylor Swfit Top Tracks'
					title: '<b>Taylor Swift Top Tracks</b> <br> <sub>US Market</sub>',
					margin:{
						l: 100,
						r: 100,
						b: 150,
						t: 150,
						pad: 4
					},
					paper_bgcolor: '#919191',
					plot_bgcolor: '#919191',
					font: {
						family: 'Newsreader, serif',
						size: 20,
						color: 'white'
					},
					xaxis: {
						title: 'Name',
						titlefont: {
							family: 'Arial, sans-serif',
							size: 12,
							color: 'white'
						},
						showticklabels: false,
						tickfont:{
							family: 'Arial, sans-serif',
							size: 12,
							color: 'white'
						}
					},
					yaxis: {
						title: 'Popularity',
						titlefont: {
							family: 'Arial, sans-serif',
							size: 12,
							color: 'white'
						},
						showticklabels: true,
						tickfont: {
							family: 'Arial, sans-serif',
							size: 12,
							color: 'white'
						}
					},
					hovermode: 'closest'
				}}
			/>
		</div>
	)
}
 

export default Tracks;