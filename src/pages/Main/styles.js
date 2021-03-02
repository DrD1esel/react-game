const styles = () => ({
  root: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'center / cover no-repeat url(./assets/images/bg.jpg)',
    '@media screen and (max-width: 1000px)': {
      background: 'center / cover no-repeat url(./assets/images/bg2.jpg)',
      backgroundPosition: '60% 75%',
    },
  },
  main: {
    fontSize: 35,
    color: 'green',
  },
});

export default styles;
