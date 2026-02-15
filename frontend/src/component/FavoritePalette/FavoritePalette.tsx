'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import { rgbaToHex } from '../../../utils/rgbaToHex';
import { handleCopyText } from '../../../utils/handleCopyText';
import { ToastContainer } from 'react-toastify';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { showFullDetailsOfColors } from '../../../utils/showFullDetailsOfColors';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { apiCall } from '../../../utils/apiCall';

interface Palette {
  id: string;
  colors: string[];
  wishlist: boolean;
}

export function FavoritePalette() {
  const [collection, setCollection] = useState<Palette[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Palette[]>([]);
  const [checked, setChecked] = useState([]);

  const router = useRouter();

  // Load favorites from localStorage

  useEffect(() => {
    const getWishlistData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URI}color-palette/wishlist`,
        );
        setCollection(response.data.data);
      } catch (error) {
        alert('Something went wrong. please try again later');
      }
    };
    getWishlistData();
  }, []);

  const handleWishlist = useCallback(
    async (e: React.MouseEvent, palette: Palette, wishlist: boolean) => {
      e.stopPropagation();
      const updated = collection.map((p) =>
        p._id === palette?._id ? { ...p, wishlist: wishlist } : p,
      );
      setCollection(updated);

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
        setCollection(collection);
      }
    },
    [collection, setCollection],
  );

  const removeFromWishlist = useCallback(
    async (e: React.MouseEvent, palette: Palette) => {
      try {
        const res = await apiCall(
          'PATCH',
          `${process.env.NEXT_PUBLIC_BASE_URI}color-palette/`,
          checked,
        );

        if (res.success) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URI}color-palette/wishlist`,
          );
          setCollection(response.data.data);
        } else {
          throw new Error('Failed to update wishlist');
        }
      } catch (error) {
        alert('Something went wrong. Please try again later.');
        // rollback optimistic update
        setCollection(collection);
      }
    },
    [collection, setCollection, checked],
  );

  // Render single color box
  const renderColorBox = (
    color: string,
    colorIndex: number,
    paletteIndex: number,
  ) => {
    const hex = color;
    const isTop = colorIndex === 0;
    const isBottom = colorIndex === 4;

    return (
      <Box
        key={`color-${paletteIndex}-${colorIndex}`}
        bgcolor={color}
        height={100}
        display="flex"
        alignItems="flex-end"
        paddingLeft="5px"
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
            px: 1,
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

  // Render palette card
  const renderPaletteCard = (unit: Palette, paletteIndex: number) => {
    const isRemoved = unit.wishlist === false;
    return (
      <Box
        key={unit.id}
        display="flex"
        flexDirection="column"
        alignContent="center"
        width={275}
        height={275}
        borderRadius={4}
        m={1}
        onClick={(e) => router.push(`palette/${unit._id}`)}
      >
        {unit.colors.map((color, i) => renderColorBox(color, i, paletteIndex))}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 1,
            gap: '10px',
            backgroundColor: isRemoved ? 'transparent' : '#bebec433',
            width: '72px',
            marginLeft: '203px',
            p: '7px',
            borderRadius: '5px',
          }}
        >
          {isRemoved ? (
            <FavoriteBorderIcon
              onClick={(e) => handleWishlist(e, unit, true)}
            />
          ) : (
            <>
              <FavoriteIcon
                fontSize="small"
                onClick={(e) => handleWishlist(e, unit, false)}
              />
              <Typography>Like</Typography>
            </>
          )}
        </Box>
      </Box>
    );
  };

  const renderPaletteCardList = (unit: Palette, paletteIndex: number) => {
    return (
      <Box
        key={unit.id}
        display="flex"
        flexDirection="column"
        alignContent="center"
        width={125}
        height={25}
        borderRadius={1}
        // m={10}
        marginBottom={'100px'}
        paddingBottom={'75px'}
        onClick={(e) => router.push(`palette/${unit._id}`)}
        sx={{ backgroundColor: 'red' }}
      >
        {unit.colors.map((color, i) => renderColorBox(color, i, paletteIndex))}
      </Box>
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allId = collection.map((col) => col._id);
      setChecked(allId);
    } else {
      setChecked([]);
    }
  };

  return (
    <Box
      width="100%"
      minHeight="100vh"
      p={{ xs: 2, sm: 4, md: 8 }}
      sx={{ display: 'flex' }}
    >
      <Box
        width="80%"
        minHeight="100vh"
        p={{ xs: 2, sm: 4, md: 8 }}
      >
        <Grid container spacing={3} justifyContent="center" flexWrap="wrap">
          {collection.length ? (
            collection.map((unit, index) => renderPaletteCard(unit, index))
          ) : (
            <h1>Your wishlist is empty. Add some favorites to get started!</h1>
          )}
        </Grid>
        <ToastContainer />
      </Box>
      <Box
        width="20%"
        minHeight="100vh"
        p={{ xs: 2, sm: 4, md: 8 }}
      >
       {collection.length > 0 && <>
        <FormControlLabel
          control={<Checkbox onChange={handleChange} />}
          label="All"
        />

        <Button onClick={removeFromWishlist}>Remove Wishlist</Button></>}

        {collection.map((unit, index) => {
          const handleChange2 = (
            event: React.ChangeEvent<HTMLInputElement>,
          ) => {
            if (event.target.checked) {
              setChecked((prev) => [...prev, event.target.id]);
            } else {
              setChecked((prev) =>
                prev.filter((item) => item !== event.target.id),
              );
            }
          };

          return (
            <>
              <Checkbox
                id={unit._id}
                checked={checked.includes(unit._id)}
                onChange={handleChange2}
              />
              {renderPaletteCardList(unit, index)}
            </>
          );
        })}
      </Box>
    </Box>
  );
}
