import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D4F0F0', // 민트색 (포인트 컬러)
    },
    secondary: {
      main: '#E8DFF5', // 라벤더색 (보조 포인트 컬러)
    },
    background: {
      default: '#F7F8FA', // 배경색
      paper: '#FFFFFF', // 카드 등 컴포넌트 배경색
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // 기본 폰트 설정 (추후 변경 가능)
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 버튼 텍스트 대문자 변환 방지
        },
      },
    },
  },
});

export default theme;
