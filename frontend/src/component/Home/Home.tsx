"use client";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { rgbaToHex } from "../../../utils/rgbaToHex";
import { handleCopyText } from "../../../utils/handleCopyText";
import { showFullDetailsOfColors } from "../../../utils/showFullDetailsOfColors";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useApi } from '@/hooks/useApi';
import { apiCall } from '../../../utils/apiCall';

interface Palette {
  _id: string;
  colors: string[];
}

export default function Home() {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [visibleItems, setVisibleItems] = useState<Palette[]>([]);
  const [selectedPalettes, setSelectedPalettes] = useState<Palette[]>([]);
  const [page, setPage] = useState<number>(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const  { data, loading, error } = useApi(`GET` ,`${process.env.NEXT_PUBLIC_BASE_URI}color-palette/`)
//   useEffect(()=>{
// const res = apiCall('GET', `${process.env.NEXT_PUBLIC_BASE_URI}color-palette/`);
// console.log(res, 'apicall function')
//   }, [])
  

  // console.log(data, loading, error, 'data')
  const ITEMS_PER_PAGE = 8;

  // Generate color palettes (used only if not found in localStorage)
  // const generateColorPalette = useCallback((): Palette[] => {
  //   return Array.from({ length: 10000 }, () => {
  //     const r = Math.floor(Math.random() * 256);
  //     const g = Math.floor(Math.random() * 256);
  //     const b = Math.floor(Math.random() * 256);

  //     const rgba = Array.from({ length: 5 }, (_, i) =>
  //       i === 4
  //         ? `rgba(${r},${g},${b},1)`
  //         : `rgba(${r},${g},${b},0.${i * 2 + 2})`
  //     );

  //     return { _id: uuidv4(), colors: rgba };
  //   });
  // }, []);

  // Initialize palettes from localStorage
  useEffect(() => {
  const getUser = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}color-palette/`);
    setPalettes(response.data.data)
    console.log(response, 'api response');
  } catch (error) {
    console.error(error, 'api error');
  }
}
getUser();
    const allColorPaletteRaw = localStorage.getItem("allColorPalette");
    const selectedRaw = localStorage.getItem("selectedColorPalette");
    const colorPaletteIndexRaw = localStorage.getItem("colorPaletteIndex");

    const allPalettes = allColorPaletteRaw
      ? JSON.parse(allColorPaletteRaw)
      : getUser();

    const selectedPalettesLocal: Palette[] = selectedRaw
      ? JSON.parse(selectedRaw)
      : [];

    const colorPaletteIndex = colorPaletteIndexRaw
      ? JSON.parse(colorPaletteIndexRaw)
      : [];

    // remove unwanted palettes if colorPaletteIndex exists
    const updatedSelected = colorPaletteIndex.length
      ? selectedPalettesLocal.filter(
          (p) => !colorPaletteIndex.includes(p._id)
        )
      : selectedPalettesLocal;

    localStorage.setItem("allColorPalette", JSON.stringify(allPalettes));
    localStorage.setItem("selectedColorPalette", JSON.stringify(updatedSelected));
    localStorage.setItem("colorPaletteIndex", JSON.stringify([]));
        console.log(allPalettes)
    // setPalettes(allPalettes);
    setSelectedPalettes(updatedSelected);
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
    console.log(palettes)
    setVisibleItems(palettes.slice(0, page * ITEMS_PER_PAGE));
  }, [palettes, page]);

  // Add to favorites
  const handleAddFavorite = useCallback((e: React.MouseEvent, palette: Palette) => {
    e.stopPropagation();
    console.log(palette)
    const updated = [...selectedPalettes, palette];
    setSelectedPalettes(updated);
    localStorage.setItem("selectedColorPalette", JSON.stringify(updated));
  }, [selectedPalettes]);

  // Remove from favorites
  const handleRemoveFavorite = useCallback((e: React.MouseEvent, _id: string) => {
    e.stopPropagation();
    const updated = selectedPalettes.filter((p) => p._id !== _id);
    setSelectedPalettes(updated);
    localStorage.setItem("selectedColorPalette", JSON.stringify(updated));
  }, [selectedPalettes]);

  // Render color box
  const renderColorBox = (color: string, colorIndex: number, paletteIndex: number) => {
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
          cursor: "pointer",
          borderRadius: `${isTop ? "5px 5px 0 0" : isBottom ? "0 0 5px 5px" : "0"}`,
          "&:hover .color-value": { opacity: 1 },
        }}
      >
        <Typography
          className="color-value"
          fontSize="15px"
          color="white"
          sx={{
            opacity: 0,
            transition: "opacity 0.2s ease-in-out",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "2px 8px",
            borderRadius: "4px",
            mb: "5px",
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
          {visibleItems.length === 0 &&          <Box sx={{ height : '60vh', display: 'flex', justifyContent : 'center', alignItems : 'center', overflowY : '-moz-hidden-unscrollable'}}>
      <CircularProgress />
    </Box>
}

      <Grid container spacing={3} justifyContent="center" flexWrap="wrap">
        {visibleItems.map((palette, paletteIndex) => {
          const isSelected = selectedPalettes.some((p) => p._id === palette._id);
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
                renderColorBox(color, colorIndex, paletteIndex)
              )}
              <Box
              key={palette._id}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  p: "7px",
                  borderRadius: "5px",
                }}
              >
                {isSelected ? (
                  <FavoriteIcon
                    fontSize="small"
                    onClick={(e) => handleRemoveFavorite(e, palette._id)}
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={(e) => handleAddFavorite(e, palette)}
                  />
                )}
              </Box>
            </Box>
          );
        })}
        <div ref={loaderRef} style={{ height: "50px", width: "100%" }} />
      </Grid>
      <ToastContainer />
    </Box>
  );
}
