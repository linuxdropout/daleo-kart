 docker run -i --init --rm --cap-add=SYS_ADMIN \
   --name puppeteer-chrome scraper \
   node -e "`cat scraper.js`"