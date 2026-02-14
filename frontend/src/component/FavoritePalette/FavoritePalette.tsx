"use client";
import { useEffect, useState, useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { rgbaToHex } from "../../../utils/rgbaToHex";
import { handleCopyText } from "../../../utils/handleCopyText";
import { ToastContainer } from "react-toastify";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { showFullDetailsOfColors } from "../../../utils/showFullDetailsOfColors";
import { useRouter } from "next/navigation";

interface Palette {
  id: string;
  colors: string[];
}

export function FavoritePalette() {
  const [collection, setCollection] = useState<Palette[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const router = useRouter();

  // Load favorites from localStorage 
  useEffect(() => {
    const selectedRaw = localStorage.getItem("selectedColorPalette");
    const indexRaw = localStorage.getItem("colorPaletteIndex");

    const selected: Palette[] = selectedRaw ? JSON.parse(selectedRaw) : [];
    const removed: string[] = indexRaw ? JSON.parse(indexRaw) : [];

    const updatedCollection = selected.filter((p) => !removed.includes(p.id));

    localStorage.setItem("selectedColorPalette", JSON.stringify(updatedCollection));
    localStorage.setItem("colorPaletteIndex", JSON.stringify([]));

    setCollection(updatedCollection);
    setRemovedIds([]);
  }, []);

  // Store removed palette ID 
  const handleRemove = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updatedRemoved = [...removedIds, id];
    setRemovedIds(updatedRemoved);
    localStorage.setItem("colorPaletteIndex", JSON.stringify(updatedRemoved));
  }, [removedIds]);

  // Revert removed palette ID 
  const handleRestore = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updatedRemoved = removedIds.filter((i) => i !== id);
    setRemovedIds(updatedRemoved);
    localStorage.setItem("colorPaletteIndex", JSON.stringify(updatedRemoved));
  }, [removedIds]);

  // Render single color box 
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
        paddingLeft="5px"
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
            px: 1,
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

  // Render palette card 
  const renderPaletteCard = (unit: Palette, paletteIndex: number) => {
    const isRemoved = removedIds.includes(unit.id);

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
        onClick={(e) => showFullDetailsOfColors(e, unit, router)}
      >
        {unit.colors.map((color, i) => renderColorBox(color, i, paletteIndex))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mt: 1,
            gap: "10px",
            backgroundColor: isRemoved ? "transparent" : "#bebec433",
            width : '72px',
            marginLeft : '203px',
            p: "7px",
            borderRadius: "5px",
          }}
        >
          {isRemoved ? (
            <FavoriteBorderIcon onClick={(e) => handleRestore(e, unit.id)} />
          ) : (
            <>
              <FavoriteIcon fontSize="small" onClick={(e) => handleRemove(e, unit.id)} />
              <Typography>Like</Typography>
            </>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box width="100%" minHeight="100vh" p={{ xs: 2, sm: 4, md: 8 }}>
      <Grid container spacing={3} justifyContent="center" flexWrap="wrap">
        {collection.map((unit, index) => renderPaletteCard(unit, index))}
      </Grid>
      <ToastContainer />
    </Box>
  );
}
