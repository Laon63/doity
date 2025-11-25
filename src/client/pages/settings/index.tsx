import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import { supabase } from 'client/lib/supabaseClient';
import useAuthStore from 'client/store/authStore';
import useThemeStore, { COLOR_PALETTES, Language } from 'client/store/themeStore';
import { t, translations } from 'client/lib/i18n';

function SettingsPage() {
  const session = useAuthStore((state) => state.session);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const language = useThemeStore((state) => state.language);
  const setPrimaryColor = useThemeStore((state) => state.setPrimaryColor);
  const setLanguage = useThemeStore((state) => state.setLanguage);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState(session?.user?.email || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      loadUserProfile();
    }
  }, [session?.user?.id]);

  const loadUserProfile = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('display_name, profile_picture_url')
        .eq('id', session?.user?.id)
        .single();

      if (!userError && userData) {
        setDisplayName(userData.display_name || '');
        setProfilePictureUrl(userData.profile_picture_url || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      setMessage({ type: 'error', text: t(language, 'fillAllFields') });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: displayName,
          profile_picture_url: profilePictureUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session?.user?.id);

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: t(language, 'nameUpdated') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t(language, 'error') });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: t(language, 'fillAllFields') });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: t(language, 'passwordMismatch') });
      return;
    }

    setLoading(true);
    try {
      // Sign in with current password to verify
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session?.user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setMessage({ type: 'error', text: t(language, 'oldPasswordIncorrect') });
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setMessage({ type: 'error', text: updateError.message });
      } else {
        setMessage({ type: 'success', text: t(language, 'passwordChanged') });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setMessage({ type: 'error', text: t(language, 'error') });
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t(language, 'settings')}
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {/* Profile Section */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          {t(language, 'profile')}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 1,
                  bgcolor: primaryColor,
                  color: '#fff',
                  fontSize: '2.5rem',
                }}
              >
                {displayName ? displayName.charAt(0).toUpperCase() : session?.user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption">{t(language, 'profilePicture')}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label={t(language, 'name')}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label={t(language, 'email')}
              value={userEmail}
              disabled
              margin="normal"
              type="email"
            />
            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : t(language, 'save')}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Password Change Section */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          {t(language, 'changePassword')}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <TextField
          fullWidth
          label={t(language, 'currentPassword')}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label={t(language, 'newPassword')}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label={t(language, 'confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleChangePassword}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : t(language, 'update')}
        </Button>
      </Card>

      {/* Theme Settings Section */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          {t(language, 'themeSettings')}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {t(language, 'primaryColor')}
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(COLOR_PALETTES).map(([name, color]) => (
            <Grid item key={name}>
              <Box
                onClick={() => handlePrimaryColorChange(color)}
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: color,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: primaryColor === color ? '3px solid #000' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Language Settings Section */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          {t(language, 'languageSettings')}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          {t(language, 'selectLanguage')}
        </Typography>
        <Select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ko">한국어</MenuItem>
        </Select>
      </Card>
    </Box>
  );
}

export default SettingsPage;
