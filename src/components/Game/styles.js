const styles = () => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
    color: 'white',
    '& > *': {
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 20,
      marginBottom: 20,      
      borderRadius: 5,
    },
  },
  canvas: {
    width: '100%',
    height: '100%',
    imageRendering: 'pixelated',
  },
  canvas2: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  apOn: {
    color: 'green',
  },
  apOff: {
    color: 'red',
  }
});

export default styles;
