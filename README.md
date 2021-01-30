# PIA Updater

I've had issues updating the Private Internet Access VPN on linux through the PIA application. The application will let me download the update, but when I click "install", it seemingly does nothing.
To update the PIA application I have to download and run the install script.

Because I'm lazy, I wrote this script to partially automate that process.

Run `node main.js` to download the latest PIA install script for linux to `/tmp/pia.run`. This script will then run that install script.
