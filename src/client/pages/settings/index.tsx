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
  useTheme,
} from '@mui/material';
import { supabase } from 'client/lib/supabaseClient';
import useAuthStore from 'client/store/authStore';
import useThemeStore, {
  COLOR_PALETTES,
  Language,
} from 'client/store/themeStore';
import { useTranslation } from 'react-i18next';
import { useProfileQuery } from 'client/hooks/queries/useProfileQuery';
import { useUpdateProfileMutation } from 'client/hooks/mutations/useProfileMutations';
import { getContrastTextColor } from 'client/utils/colors';

function SettingsPage() {
  const theme = useTheme();
  const { t } = useTranslation('common');
  const session = useAuthStore((state) => state.session);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const language = useThemeStore((state) => state.language);
  const setPrimaryColor = useThemeStore((state) => state.setPrimaryColor);
  const setLanguage = useThemeStore((state) => state.setLanguage);

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [userEmail] = useState(session?.user?.email || '');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // React Query for profile data
  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery(
    session?.user?.id
  );
  const updateProfileMutation = useUpdateProfileMutation(session?.user?.id);

  // Effect to sync fetched profile data with local and global state
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setPrimaryColor(profile.theme_color);
      setLanguage(profile.language as Language);
    }
  }, [profile, setPrimaryColor, setLanguage]);

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      setMessage({ type: 'error', text: t('fillAllFields') });
      return;
    }

    updateProfileMutation.mutate(
      {
        display_name: displayName,
        theme_color: primaryColor,
        language: language,
      },
      {
        onSuccess: (data) => {
          setMessage({ type: 'success', text: t('nameUpdated') });
          // Update Zustand store with the new values
          if (data) {
            setPrimaryColor(data.theme_color);
            setLanguage(data.language as Language);
          }
        },
        onError: (error) => {
          setMessage({ type: 'error', text: error.message });
        },
      }
    );
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: t('fillAllFields') });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: t('passwordMismatch') });
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setMessage({ type: 'error', text: updateError.message });
      } else {
        setMessage({ type: 'success', text: t('passwordChanged') });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ type: 'error', text: err.message });
      } else {
        setMessage({ type: 'error', text: 'An unknown error occurred' });
      }
    } finally {
      // setLoading(false);
    }
  };

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const isLoading = isLoadingProfile || updateProfileMutation.isPending;

  return (
    <Box sx={{ maxWidth: 700, py: 2 }}>
      <Typography
        variant="h5"
        component="h1"
        sx={{ mb: 3, fontWeight: 'bold' }}
      >
        {t('settings')}
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {isLoadingProfile ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Profile Section */}
          <Card sx={{ mb: 2, p: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1.5, fontWeight: 'bold' }}
            >
              {t('profile')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    bgcolor: primaryColor,
                    color: getContrastTextColor(primaryColor),
                    fontSize: '2.5rem',
                  }}
                >
                  {displayName
                    ? displayName.charAt(0).toUpperCase()
                    : session?.user?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>

              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label={t('name')}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  label={t('email')}
                  value={userEmail}
                  disabled
                  margin="dense"
                  size="small"
                  type="email"
                />
              </Box>
            </Box>
          </Card>

          {/* Password Change Section */}
          <Card sx={{ mb: 2, p: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1.5, fontWeight: 'bold' }}
            >
              {t('changePassword')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label={t('currentPassword')}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label={t('newPassword')}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="dense"
              size="small"
            />
            <TextField
              fullWidth
              label={t('confirmPassword')}
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
                disabled={isLoading}
                size="medium"
              >
                {isLoading ? <CircularProgress size={20} /> : t('update')}
              </Button>
            </Box>
          </Card>

          {/* Theme Settings Section */}
          <Card sx={{ mb: 2, p: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1.5, fontWeight: 'bold' }}
            >
              {t('themeSettings')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" sx={{ mb: 1.5 }}>
              {t('primaryColor')}
            </Typography>
            <Grid container spacing={1}>
              {Object.entries(COLOR_PALETTES).map(([name, color]) => {
                const displayText = language === 'ko' ? '가' : 'Aa';
                const textColor = getContrastTextColor(color);
                return (
                  <Grid item key={name}>
                    <Box
                      onClick={() => handlePrimaryColorChange(color)}
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: color,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border:
                          primaryColor === color
                            ? '3px solid #000'
                            : '1px solid #ddd',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color: textColor,
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                        }}
                      >
                        {displayText}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Card>

          {/* Language Settings Section */}
          <Card sx={{ p: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1.5, fontWeight: 'bold' }}
            >
              {t('languageSettings')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" sx={{ mb: 1.5 }}>
              {t('selectLanguage')}
            </Typography>
            <Select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="en">{t('english')}</MenuItem>
              <MenuItem value="ko">{t('korean')}</MenuItem>
            </Select>
          </Card>

          {/* Consolidated Save Changes Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={isLoading}
              size="large"
            >
              {isLoading ? <CircularProgress size={24} /> : t('saveChanges')}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default SettingsPage;
