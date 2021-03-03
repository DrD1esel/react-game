const styles = () => ({
  root: {
    background: 'center / cover no-repeat url(./assets/images/bg.jpg)',
  },
  paper: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
  },
  slider: {
    width: 200,
  },
  sliderWrapper: {
    marginLeft: 30,
  },
  title: {
    marginTop: 20,
  },
  textField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },    
    '& .MuiOutlinedInput-input': {
    color: 'white',
    },    
  },
});

export default styles;
