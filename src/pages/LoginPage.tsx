import { useState } from 'react';
import { Avatar, Box, Button, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { supabase } from '../lib/supabaseClient';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Email not confirmed') {
        alert('이메일 인증이 필요합니다. 가입 시 사용한 이메일의 받은 편지함을 확인해주세요.');
      } else {
        alert(`로그인 중 오류가 발생했습니다: ${error.message}`);
      }
    } else {
      navigate('/');
    }
  };

  return (
    <FormContainer>
      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        로그인
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="이메일 주소"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="비밀번호"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          로그인
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <RouterLink to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="body2">
                계정이 없으신가요? 회원가입
              </Typography>
            </RouterLink>
          </Grid>
        </Grid>
      </Box>
    </FormContainer>
  );
}

export default LoginPage;
