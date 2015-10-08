#Traffic Jam Hackathon App

Members: Alan Hietala alan.hietala@gmail.com, Pravin Advani pravinadvani@gmail.com

Fun visualization for the 24h traffic flow data for the city of toronto. This is all the traffic studies they have run over the last 5 years.

##Installation

Install MongoDB http://mongodb.org 

Install NodeJS http://nodejs.org

Install bower 

> sudo npm install -g bower

## Import Data

untar the data in the datasets/volume directory

Import data in the DataSets/volume directory into mongodb.

> mongoimport -d trafficjam -c traffic_volume --type csv --file filename.csv --headerline

##set up your indexes

> mongo ./DataSets/load-indexes.js


##Set up the geocoder

None of this data was geocoded so we have to do that. Obviously geocoding 35MM records isn't possible in the timeframe of the hackathon so we decided to base our geocodes around the ARTERYCODE in the supplied data. 

The geocoder also normalizes names so that they are in a format that google can understand.

in the geocoder directory run:
>  npm install

update the script to use your google api key WARNING: you can burn through 2500 geocode credits very fast with this data set.

run the geocoder, it will target high average flow intersections first. you can play with the filter on normalized count to control how many records you get for geocoding.

> node app.js 

## Install the app dependncies in /server

from the server directory run:

> npm install

> bower install

## run the app 

> ./bin/www

it will start the app on port 3000 to begin with
