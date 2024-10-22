import React, { useRef } from 'react';
import { Box, Button, Avatar, Typography } from '@mui/material';
import { Upload } from 'lucide-react';

interface AvatarUploadProps {
  currentUrl?: string;
  onImageSelect: (dataUrl: string) => void;
}

export default function AvatarUpload({ currentUrl, onImageSelect }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onImageSelect(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Avatar
        src={currentUrl}
        sx={{ width: 100, height: 100, cursor: 'pointer' }}
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <Button
        variant="outlined"
        startIcon={<Upload size={16} />}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Avatar
      </Button>
      <Typography variant="caption" color="text.secondary">
        Click to upload (max 5MB)
      </Typography>
    </Box>
  );
}