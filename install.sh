#!/bin/sh

# Reset
Color_Off='\033[0m'       # Text Reset

# Regular Colors
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue
Purple='\033[0;35m'       # Purple
Cyan='\033[0;36m'         # Cyan
White='\033[0;37m'        # White

# Bold
BBlack='\033[1;30m'       # Black
BRed='\033[1;31m'         # Red
BGreen='\033[1;32m'       # Green
BYellow='\033[1;33m'      # Yellow
BBlue='\033[1;34m'        # Blue
BPurple='\033[1;35m'      # Purple
BCyan='\033[1;36m'        # Cyan
BWhite='\033[1;37m'       # White

printf "${Yellow}Installing npm depencies for each MJML packages ${Color_Off} \n"
npm install
gulp install

printf "${BGreen}Done.${Color_Off} \n"
cd packages

printf "${Yellow}Linking dependencies for every mjml packages.${Color_Off} \n"

cd mjml-button && npm link && npm link mjml-core && cd ..
cd mjml-cli && npm link && npm link mjml-core && cd ..
cd mjml-column && npm link && npm link mjml-core && cd ..
cd mjml-container && npm link && npm link mjml-core && cd ..
cd mjml-core && npm link && npm link mjml-core && cd ..
cd mjml-divider && npm link && npm link mjml-core && cd ..
cd mjml-html && npm link && npm link mjml-core && cd ..
cd mjml-image && npm link && npm link mjml-core && cd ..
cd mjml-invoice && npm link && npm link mjml-core && npm link mjml-table && npm link mjml-invoice-item && cd ..
cd mjml-invoice-item && npm link && npm link mjml-core && cd ..
cd mjml-list && npm link && npm link mjml-core && cd ..
cd mjml-location && npm link && npm link mjml-core && npm link mjml-text && cd ..
cd mjml-raw && npm link && npm link mjml-core && cd ..
cd mjml-section && npm link && npm link mjml-core && cd ..
cd mjml-social && npm link && npm link mjml-core && cd ..
cd mjml-spacer && npm link && npm link mjml-core && cd ..
cd mjml-table && npm link && npm link mjml-core && cd ..
cd mjml-text && npm link && npm link mjml-core && cd ..

printf "${BGreen}Done.${Color_Off} \n"
printf "${Yellow}Linking dependencies for MJML package.${Color_Off} \n"

cd mjml
npm link mjml-button
npm link mjml-cli
npm link mjml-column
npm link mjml-container
npm link mjml-core
npm link mjml-divider
npm link mjml-html
npm link mjml-image
npm link mjml-invoice
npm link mjml-invoice
npm link mjml-list
npm link mjml-location
npm link mjml-raw
npm link mjml-section
npm link mjml-social
npm link mjml-spacer
npm link mjml-table
npm link mjml-text

cd ../..

printf "${BGreen}Done.${Color_Off} Happy coding ! 🍺 \n"
