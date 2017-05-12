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

printf "${BYellow}Installing yarn depencies for mono repo ${Color_Off} \n"
yarn

printf "${BGreen}Done.${Color_Off} \n"
cd packages

printf "${BYellow}Linking dependencies for every mjml packages.${Color_Off} \n"

# Core
printf "${Yellow}Linking core${Color_Off} \n"
cd mjml-core && yarn && yarn link && cd ..

# Core dependencies
printf "${Yellow}Linking core dependencies${Color_Off} \n"
cd mjml-validator && yarn && yarn link && yarn link mjml-core && cd ..

# Link core dependencies to core
cd mjml-core && yarn link mjml-validator && cd ..

# Mj elements
printf "${Yellow}Linking MJML standard elements${Color_Off} \n"
cd mjml-accordion && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-button && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-carousel && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-column && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-container && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-divider && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-group && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-head-attributes && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-head-font && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-head-style && yarn && yarn link && cd ..
cd mjml-head-title && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-hero && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-html && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-image && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-list && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-raw && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-section && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-social && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-spacer && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-table && yarn && yarn link mjml-core && yarn link && cd ..
cd mjml-text && yarn && yarn link mjml-core && yarn link && cd ..

cd mjml-invoice && yarn && yarn link mjml-core && yarn link mjml-table && yarn link && cd ..
cd mjml-location && yarn && yarn link mjml-core && yarn link mjml-text && yarn link mjml-image && yarn link && cd ..
cd mjml-navbar && yarn && yarn link mjml-core && yarn link mjml-section && yarn link && cd ..
cd mjml-wrapper && yarn && yarn link mjml-core && yarn link mjml-section && yarn link && cd ..

# Cli
printf "${Yellow}Linking core${Color_Off} \n"
cd mjml-cli && yarn && yarn link mjml-core && yarn link ; cd ..

printf "${BGreen}Done.${Color_Off} \n"

printf "${BYellow}Linking dependencies for MJML package.${Color_Off} \n"
cd mjml
yarn link mjml-accordion
yarn link mjml-button
yarn link mjml-carousel
yarn link mjml-cli
yarn link mjml-column
yarn link mjml-container
yarn link mjml-core
yarn link mjml-divider
yarn link mjml-group
yarn link mjml-head-attributes
yarn link mjml-head-font
yarn link mjml-head-style
yarn link mjml-head-title
yarn link mjml-hero
yarn link mjml-html
yarn link mjml-image
yarn link mjml-invoice
yarn link mjml-list
yarn link mjml-location
yarn link mjml-navbar
yarn link mjml-raw
yarn link mjml-section
yarn link mjml-social
yarn link mjml-spacer
yarn link mjml-table
yarn link mjml-text
yarn link mjml-validator
yarn link mjml-wrapper
cd ../..

printf "${BGreen}Done.${Color_Off} ${Green}Building the project ${Color_Off} \n"
./node_modules/.bin/gulp build

printf "${BGreen}Done.🍺 ${Color_Off} \n ${Green}Use ${Color_Off}${BGreen}gulp build${Color_Off}${Green} to build the whole monorepo ! \n And run ${Color_Off}${BGreen}node test.js${Color_Off}${Green} inside ${Color_Off}${BGreen}packages/mjml${Color_Off}${Green} to test your installation ${Color_Off}\n"
