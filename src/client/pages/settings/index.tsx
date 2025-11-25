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
    <Box sx={{ maxWidth: 700, py: 2 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
        {t(language, 'settings')}
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {/* Profile Section */}
      <Card sx={{ mb: 2, p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
          {t(language, 'profile')}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 0.5,
                  bgcolor: primaryColor,
                  color: '#fff',
                  fontSize: '2rem',
                }}
              >
                {displayName ? displayName.charAt(0).toUpperCase() : session?.user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption">{t(language, 'profilePicture')}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label={t(language, 'name')}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label={t(language, 'email')}
              value={userEmail}
              disabled
              margin="dense"
              size="small"
              type="email"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
              <Button
                variant="contained"
                onClick={handleUpdateProfile}
                disabled={loading}
                size="medium"
              >
                {loading ? <CircularProgress size={20} /> : t(language, 'save')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Password Change Section */}
      <Card sx={{ mb: 2, p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
          {t(language, 'changePassword')}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TextField
          fullWidth
          label={t(language, 'currentPassword')}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          margin="dense"
          size="small"
        />
        <TextField
          fullWidth
          label={t(language, 'newPassword')}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="dense"
          size="small"
        />
        <TextField
          fullWidth
          label={t(language, 'confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="dense"
          size="small"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={loading}
            size="medium"
          >
            {loading ? <CircularProgress size={20} /> : t(language, 'update')}
          </Button>
        </Box>
      </Card>

      {/* Theme Settings Section */}
      <Card sx={{ mb: 2, p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
          {t(language, 'themeSettings')}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" sx={{ mb: 1.5 }}>
          {t(language, 'primaryColor')}
        </Typography>
        <Grid container spacing={1}>
          {Object.entries(COLOR_PALETTES).map(([name, color]) => (
            <Grid item key={name}>
              <Box
                onClick={() => handlePrimaryColorChange(color)}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: color,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: primaryColor === color ? '3px solid #000' : '1px solid #ddd',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Language Settings Section */}
      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
          {t(language, 'languageSettings')}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" sx={{ mb: 1.5 }}>
          {t(language, 'selectLanguage')}
        </Typography>
        <Select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ko">한국어</MenuItem>
        </Select>
      </Card>
    </Box>
  );
}

export default SettingsPage;
