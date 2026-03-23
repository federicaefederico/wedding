import fs from 'fs';
import https from 'https';

https.get('https://minimalist-demo.thedigitalyes.com/assets/index-DsChDnq7.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = data.match(/https?:\/\/[^\s"'<>]+\.(mp4|webm)/g);
    console.log(urls ? urls.join('\n') : 'No videos found');
  });
});
