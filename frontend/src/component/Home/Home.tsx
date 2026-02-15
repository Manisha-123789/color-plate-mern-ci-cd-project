'use client';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { rgbaToHex } from '../../../utils/rgbaToHex';
import { handleCopyText } from '../../../utils/handleCopyText';
import { showFullDetailsOfColors } from '../../../utils/showFullDetailsOfColors';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { apiCall } from '../../../utils/apiCall';

interface Palette {
  _id: string;
  colors: string[];
  wishlist: boolean;
}

export default function Home() {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [visibleItems, setVisibleItems] = useState<Palette[]>([]);
  const [page, setPage] = useState<number>(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URI}color-palette/`,
        );
        setPalettes(response.data.data);
      } catch (error) {
        alert(
          'Something went wrong. please try again later'
        );
      }
    };
    getUser();
  }, []);

  // Infinite scroll setup
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage((prev) => prev + 1);
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  // Update visible palettes when page or palettes change
  useEffect(() => {
    setVisibleItems(palettes.slice(0, page * ITEMS_PER_PAGE));
  }, [palettes, page]);

  // Add to favorites
  const handleWishlist = useCallback(
    async (e: React.MouseEvent, palette: Palette, wishlist: boolean) => {
      e.stopPropagation();
      const updated = palettes.map((p) =>
        p._id === palette._id ? { ...p, wishlist: wishlist } : p,
      );
      setPalettes(updated);

      try {
        const res = await apiCall(
          'PATCH',
          `${process.env.NEXT_PUBLIC_BASE_URI}color-palette/${palette._id}`,
          { wishlist: wishlist },
        );

        if (!res.success) {
          throw new Error('Failed to update wishlist');
        }
      } catch (error) {
        alert('Something went wrong. Please try again later.');
        // rollback optimistic update
        setPalettes(palettes);
      }
    },
    [palettes, setPalettes],
  );

  // Render color box
  const renderColorBox = (
    color: string,
    colorIndex: number,
    paletteIndex: number,
  ) => {
    const hex = rgbaToHex(color);
    const isTop = colorIndex === 0;
    const isBottom = colorIndex === 4;

    return (
      <Box
        key={`color-${paletteIndex}-${colorIndex}`}
        bgcolor={color}
        height={100}
        display="flex"
        alignItems="flex-end"
        sx={{
          cursor: 'pointer',
          borderRadius: `${isTop ? '5px 5px 0 0' : isBottom ? '0 0 5px 5px' : '0'}`,
          '&:hover .color-value': { opacity: 1 },
        }}
      >
        <Typography
          className="color-value"
          fontSize="15px"
          color="white"
          sx={{
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '2px 8px',
            borderRadius: '4px',
            mb: '5px',
          }}
          onClick={(e) => handleCopyText(e, hex)}
        >
          {hex}
        </Typography>
      </Box>
    );
  };

  return (
    <Box width="100%" minHeight="100vh" p={{ xs: 2, sm: 4, md: 8 }}>
      {visibleItems.length === 0 && (
        <Box
          sx={{
            height: '60vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflowY: '-moz-hidden-unscrollable',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3} justifyContent="center" flexWrap="wrap">
        {visibleItems.map((palette, paletteIndex) => {
          return (
            <Box
              key={palette._id}
              display="flex"
              flexDirection="column"
              width={275}
              height={275}
              borderRadius={4}
              m={1}
              onClick={(e) => showFullDetailsOfColors(e, palette, router)}
            >
              {palette.colors.map((color, colorIndex) =>
                renderColorBox(color, colorIndex, paletteIndex),
              )}
              <Box
                key={palette._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  p: '7px',
                  borderRadius: '5px',
                }}
              >
                {palette?.wishlist ? (
                  <FavoriteIcon
                    fontSize="small"
                    onClick={(e) => handleWishlist(e, palette, false)}
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={(e) => handleWishlist(e, palette, true)}
                  />
                )}
              </Box>
            </Box>
          );
        })}
        <div ref={loaderRef} style={{ height: '50px', width: '100%' }} />
      </Grid>
      <ToastContainer />
    </Box>
  );
}
