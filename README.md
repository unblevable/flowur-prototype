# Flowur
**Flowur** is an app that automates flowchart visualization. By running layout algorithms and making quite a few assumptions, it takes the responsibility of positioning flowchart components (i.e. boxes and arrows) away from the user.

## Usage
1. A user inputs her flowchart data through a click and drag interface.
2. Flowur generates a collection of visualizations from which the user can choose.
3. The user can tweak spacing and styling before downloading the flowchart as an image.

## Quick Start
Flowur is a web application that needs to be run on a web server. Either move the project into an existing web server or create one on the fly:

### Start a Web Server

#### NodeJS

    npm install -g http-server
    http-server -p 8080 flowur-prototype/

#### Python 3

    pushd flowur-prototype/; python -m http.server 8080; popd

If you're using Python 2, replace `http.server` with `SimpleHTTPServer`.

### Run the App
In any web browser visit `http://localhost:8080/flowur-prototype/app.html`.
