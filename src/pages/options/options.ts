import './options.scss';

console.log('options!');

setTimeout(() => {
  //document.body.requestFullscreen();
  document.documentElement.requestFullscreen()
}, 100);
