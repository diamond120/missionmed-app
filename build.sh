node -v

npm -v

echo "\nRun yarn install \n"
yarn install

echo "\nRun yarn build \n"
yarn build

echo "\nRun cp .htaccess.sample dist/. \n"
cp .htaccess.sample dist/

echo "\nRun mv .htaccess.sample .htaccess \n"
mv dist/.htaccess.sample dist/.htaccess
