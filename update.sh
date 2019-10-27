git reset --hard
git pull
npm i
npx lerna bootstrap

export PORT=80
pm2 restart index --update-env