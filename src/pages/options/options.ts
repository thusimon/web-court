import './options.css';

console.log('options!');

setTimeout(() => {
  //document.body.requestFullscreen();
  document.documentElement.requestFullscreen()
}, 100);
