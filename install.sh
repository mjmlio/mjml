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

printf "${BYellow}Installing npm depencies for mono repo ${Color_Off} \n"
npm install

printf "${BGreen}Done.${Color_Off} \n"
cd packages

printf "${BYellow}Linking dependencies for every mjml packages.${Color_Off} \n"

# Core dependencies
printf "${Yellow}Linking core dependencies${Color_Off} \n"
cd mjml-validator && npm link && npm link mjml-core && cd ..
# Core
printf "${Yellow}Linking core${Color_Off} \n"
cd mjml-core && npm link mjml-validator && npm link && cd ..
# Mj elements
printf "${Yellow}Linking MJML standard elements${Color_Off} \n"
cd mjml-button && npm link mjml-core && npm link && cd ..
cd mjml-carousel && npm link mjml-core && npm link && cd ..
cd mjml-column && npm link mjml-core && npm link && cd ..
cd mjml-container && npm link mjml-core && npm link && cd ..
cd mjml-divider && npm link mjml-core && npm link && cd ..
cd mjml-group && npm link mjml-core && npm link && cd ..
cd mjml-head-attributes && npm link mjml-core && npm link && cd ..
cd mjml-head-font && npm link mjml-core && npm link && cd ..
cd mjml-head-style && npm link && cd ..
cd mjml-head-title && npm link mjml-core && npm link && cd ..
cd mjml-hero && npm link mjml-core && npm link && cd ..
cd mjml-html && npm link mjml-core && npm link && cd ..
cd mjml-image && npm link mjml-core && npm link && cd ..
cd mjml-invoice && npm link mjml-core && npm link mjml-table && npm link && cd ..
cd mjml-list && npm link mjml-core && npm link && cd ..
cd mjml-location && npm link mjml-core && npm link mjml-text && npm link mjml-image && npm link && cd ..
cd mjml-navbar && npm link mjml-core && npm link mjml-section && npm link && cd ..
cd mjml-raw && npm link mjml-core && npm link && cd ..
cd mjml-section && npm link mjml-core && npm link && cd ..
cd mjml-social && npm link mjml-core && npm link && cd ..
cd mjml-spacer && npm link mjml-core && npm link && cd ..
cd mjml-table && npm link mjml-core && npm link && cd ..
cd mjml-text && npm link mjml-core && npm link && cd ..
# Cli
printf "${Yellow}Linking core${Color_Off} \n"
cd mjml-cli && npm link mjml-core && npm link && cd ..

printf "${BGreen}Done.${Color_Off} \n"

printf "${BYellow}Linking dependencies for MJML package.${Color_Off} \n"

cd mjml
npm link mjml-button
npm link mjml-carousel
npm link mjml-cli
npm link mjml-column
npm link mjml-container
npm link mjml-core
npm link mjml-divider
npm link mjml-group
npm link mjml-head-attributes
npm link mjml-head-font
npm link mjml-head-style
npm link mjml-head-title
npm link mjml-hero
npm link mjml-html
npm link mjml-image
npm link mjml-invoice
npm link mjml-list
npm link mjml-location
npm link mjml-navbar
npm link mjml-raw
npm link mjml-section
npm link mjml-social
npm link mjml-spacer
npm link mjml-table
npm link mjml-text
npm link mjml-validator

printf "${BGreen}Done.${Color_Off} \n"

printf "${BYellow}Installing npm depencies for each MJML packages ${Color_Off} \n"
gulp install
cd ../..

printf "${BGreen}Done.${Color_Off} ${Green}Building the project ${Color_Off} \n"
gulp build
printf "${BGreen}Done.🍺 ${Color_Off} \n ${Green}Use ${Color_Off}${BGreen}gulp build${Color_Off}${Green} to build the whole monorepo ! \n And run ${Color_Off}${BGreen}node test.js${Color_Off}${Green} inside ${Color_Off}${BGreen}packages/mjml${Color_Off}${Green} to test your installation ${Color_Off}\n"
