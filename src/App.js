import React from 'react';
import logo from './logo.svg';
import './App.scss';
const electron = window.require('electron');

const {desktopCapturer, screen, shell} = electron

const fs = electron.remote.require('fs')
const os = electron.remote.require('os')
const path = electron.remote.require('path')

const notification = {
  title: 'Basic Notification',
  body: 'Short message part'
}

function not(){
  const myNotification = new window.Notification(notification.title, notification)

  myNotification.onclick = () => {
    console.log('Notification clicked')
  }
}

function screencap(){
  console.log('Gathering screens...')
  const thumbSize = determineScreenShotSize()
  let options = { types: ['screen'], thumbnailSize: thumbSize }

  desktopCapturer.getSources(options, (error, sources) => {
    if (error) return console.log(error)

    sources.forEach((source) => {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')

        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
          if (error) return console.log(error)
          shell.openExternal(`file://${screenshotPath}`)

          const message = `Saved screenshot to: ${screenshotPath}`
          console.log(message)
        })
      }
    })
  })
}
function determineScreenShotSize () {
  const screenSize = screen.getPrimaryDisplay().workAreaSize
  const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={not}>notification</button>
        <button onClick={screencap}>screen</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
