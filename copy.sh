# cp "$1/test.sh" "$1/dist"
# cp $1/rsync-exclude.txt $1/dist
# cp $1/consignes.js $1/dist
# cp $1/consignes.css $1/dist

echo "VITE_BUILD_DATE=$(date +'%d/%m/%Y %H:%M:%S')" >> $GITHUB_ENV
