import { useState } from 'react';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { supabase } from '../lib/supabaseClient';

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(`회원가입 중 오류가 발생했습니다: ${error.message}`);
    } else if (data.user) {
      alert('회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.');
      navigate('/login');
    }
  };

  return (
    <FormContainer>
      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        회원가입
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            required
            fullWidth
            id="email"
            label="이메일 주소"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            required
            fullWidth
            name="password-confirm"
            label="비밀번호 확인"
            type="password"
            id="password-confirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          가입하기
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <RouterLink to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="body2">
              이미 계정이 있으신가요? 로그인
            </Typography>
          </RouterLink>
        </Box>
      </Box>
    </FormContainer>
  );
}

export default SignupPage;
