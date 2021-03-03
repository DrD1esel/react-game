const styles = () => ({
  root: {
    position: 'fixed',
    width: 'auto',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 10,
    borderRadius: 5,
    '& > *': {
      margin: '0 10px',
      color: 'black',
      fontWeight: 'bold',
    },
  },
  img: {
    height: 30,
    objectFit: 'cover',
  },
});

export default styles;
