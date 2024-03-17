# replace paths in the CSS
LC_ALL=C find "out/_next/static/css" -type f -exec sed -i '' 's/.\/_next\/static/\.\./g' {} +

# fix the regular expressions that are not escaped - add a \ before any / if there isn't one there already
LC_ALL=C find "out/_next/static/chunks" -type f -exec sed -i '' 's/\.\\/_next\\/data/.\/_next\/data/g' {} +
