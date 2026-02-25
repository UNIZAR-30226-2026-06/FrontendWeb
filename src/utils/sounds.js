export const playSound = (type) => {
  let audioPath;
  
  switch(type) {
    case 'success':
      audioPath = '/sounds/click_okay.wav';
      break;
    case 'error':
      audioPath = '/sounds/click_error.wav';
      break;
    case 'transition':
      audioPath = '/sounds/loading.wav';
      break;
    case 'slide':
      audioPath = '/sounds/slide1.wav';
      break;
    default:
      return;
  }

  const audio = new Audio(audioPath);
  if(type === 'transition'){
    audio.playbackRate = 1; 
  }else if(type === 'slide'){
    audio.playbackRate = 2;
  }
  audio.volume = type === 'slide' ? 0.3 : 0.5;
  audio.play().catch(err => console.log("Audio play blocked", err));
};