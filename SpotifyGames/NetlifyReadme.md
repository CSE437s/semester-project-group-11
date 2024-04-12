```
# for all distributions
npx expo export 
# for just the web bundle 
npx expo export -p web

netlify deploy --dir dist
netlify deploy --prod dist
```