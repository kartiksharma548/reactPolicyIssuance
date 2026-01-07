import { createTheme, responsiveFontSizes  } from "@mui/material/styles";


const theme = createTheme({
    spacing: 4,
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#000',
            '@media (max-width:600px)': {
                fontSize: '1rem', // Example heading size for mobile
            },
            '@media (min-width:600px) and (max-width:960px)': {
                fontSize: '1.25rem', // Example heading size for tablet
            },
        },
        h2: {
            fontSize: '1.1rem',
            fontStyle: 'bold',
        },
        h3: {
            fontSize: '2.5rem',
        },
    },
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    "& + .MuiInputBase-root": {
                        marginTop: 20,
                    },
                    transform: 'translate(0px, -1.5px) scale(0.75)',

                    '&[data-shrink="false"]': {
                        transform: 'none',
                    }
                }
            },
        },
        MuiInputBase: {
            styleOverrides: {
              root: {
                '&.MuiInput-root::before': {
                  borderBottom: '1px solid #DDDDDD', // Change this to the desired border color
                },
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                '& .MuiAccordionSummary-content, & .MuiAccordionSummary-content.Mui-expanded': {
                    margin:'8px 0px',
                  },
                  '&::before': {
                    display:'none',
                  },
                  '& .MuiAccordionSummary-root':{
                    margin:'2px'
                  }
              },
            },
          },
    },
    palette: {
        background: {
            default: '#009900'//green
        },
        primary: {
            main: '#333399',//Dark Blue
        },
        secondary: {
            main: '#22334F',//pink
        },
        error: {
            main: '#D72A2A',//red
        },
        warning: {
            main: '#FC7B09',//orange
        },
        info: {
            main: '#ECF0F4',//gray
        },
        success: {
            main: '#09FE00',//green
        },
        text: {
            primary: '#22334F',//black
            secondary: '#666',//white
        },
        // Responsive font sizes
    },
    shape: {
        borderRadius: 8,
    }
});
const responsiveTheme = responsiveFontSizes(theme);
export default responsiveTheme;