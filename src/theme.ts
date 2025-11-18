import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A2D5D5', // 민트색 (포인트 컬러)
    },
    secondary: {
      main: '#E8DFF5', // 라벤더색 (보조 포인트 컬러)
    },
    background: {
      default: '#F7F8FA', // 배경색
      paper: '#FFFFFF', // 카드 등 컴포넌트 배경색
    },
    text: {
      primary: '#222222', // 더 진한 회색으로 변경하여 가독성 향상
      secondary: '#444444', // 더 진한 회색으로 변경하여 가독성 향상
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
          boxShadow: 'none', // 버튼 그림자 제거
          '&:hover': {
            boxShadow: 'none', // 호버 시에도 그림자 제거
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7ABABA', // 호버 시 테두리 색상 변경
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7ABABA', // 포커스 시 테두리 색상 변경
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#7ABABA', // 포커스 시 라벨 색상 변경
          },
        },
      },
    },
  },
});

export default theme;
