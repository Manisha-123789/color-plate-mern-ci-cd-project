"use client";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { handleCopyText } from "../../../utils/handleCopyText";
import { rgbaToHex } from "../../../utils/rgbaToHex";
import { useEffect, useRef, useState, useMemo } from "react";
import html2canvas from "html2canvas";
import { DownloadOutlined, LinkOutlined } from "@mui/icons-material";
import { usePathname } from "next/navigation";

interface Palette {
  id: string;
  colors: string[];
}

interface ColorDetailsProps {
  id: string;
}

export function ColorDetails({ id }: ColorDetailsProps) {
  const [palette, setPalette] = useState<Palette | null>(null);
  const paletteRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  //Load palette data from localStorage
  useEffect(() => {
    const getPalette = (key: string): Palette[] =>
      JSON.parse(localStorage.getItem(key) || "[]");

    const allPalettes = getPalette("allColorPalette");
    const selectedPalettes = getPalette("selectedColorPalette");

    const found =
      allPalettes.find((unit) => unit.id === id) ||
      selectedPalettes.find((unit) => unit.id === id) ||
      null;

    setPalette(found);
  }, [id]);

  // Precompute colors in hex format
  const hexColors = useMemo(
    () => palette?.colors.map((c) => rgbaToHex(c)) || [],
    [palette]
  );

  // Download palette as image
  const handleDownload = async () => {
    if (!paletteRef.current || !palette) return;
    const canvas = await html2canvas(paletteRef.current, {
      scrollY: -window.scrollY,
      onclone: (clonedDoc) => {
        const clonedDiv = clonedDoc.getElementById(palette.id);
        clonedDiv?.querySelectorAll(".nestedDiv")?.forEach((el) => {
          (el as HTMLElement).style.borderRadius = "0";
        });
      },
    });
    const link = document.createElement("a");
    link.download = `Color Palette By Manisha Bavniya ${palette.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // opy sharable link dynamically
  const handleCopyLink = (e: React.MouseEvent) => {
    const url = `${window.location.origin}${pathname}`;
    handleCopyText(e, url);
  };

  if (!palette) return null;

  return (
    <Box width="100%" minHeight="100vh" padding={{ xs: 2, sm: 4, md: 8 }}>
      <Grid container spacing={3} justifyContent="center">
        {/* ---- Palette Preview ---- */}
        <Box
          ref={paletteRef}
          id={palette.id}
          key={palette.id}
          display="flex"
          flexDirection="column"
          width={400}
          height={400}
          borderRadius={4}
          margin={1}
        >
          {palette.colors.map((color, i) => (
            <Box
              className="nestedDiv"
              key={`${palette.id}-${i}`}
              width="100%"
              height={100}
              bgcolor={color}
              display="flex"
              alignItems="flex-end"
              paddingLeft={1}
              sx={{
                cursor: "pointer",
                borderRadius:
                  i === 0
                    ? "10px 10px 0 0"
                    : i === palette.colors.length - 1
                    ? "0 0 10px 10px"
                    : 0,
                "&:hover .color-value": { opacity: 1 },
              }}
            >
              <Typography
                className="color-value"
                fontSize={15}
                color="white"
                sx={{
                  opacity: 0,
                  transition: "opacity 0.2s ease-in-out",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  mb: 0.5,
                }}
                onClick={(e) => handleCopyText(e, hexColors[i])}
              >
                {hexColors[i]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Grid>

      {/* ---- Action Buttons ---- */}
      <Box display="flex" justifyContent="center" gap={2} my={3}>
        <Button
          size="medium"
          startIcon={<DownloadOutlined />}
          variant="outlined"
          sx={{
            color: palette.colors[4],
            borderColor: palette.colors[0] || "grey",
            "&:hover": {
              borderColor: palette.colors[4],
              color: palette.colors[4],
              backgroundColor: "white",
            },
          }}
          onClick={handleDownload}
        >
          Image
        </Button>

        <Button
          size="medium"
          startIcon={<LinkOutlined />}
          variant="outlined"
          sx={{
            color: palette.colors[4],
            borderColor: palette.colors[0] || "grey",
            "&:hover": {
              borderColor: palette.colors[4],
              color: palette.colors[4],
              backgroundColor: "white",
            },
          }}
          onClick={handleCopyLink}
        >
          Link
        </Button>
      </Box>

      {/* ---- Color Circles ---- */}
      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={4}
        mb={4}
      >
        {palette.colors.map((color, i) => (
          <Box
            key={i}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={0.5}
            sx={{ cursor: "pointer" }}
          >
            <Box
              width={40}
              height={40}
              borderRadius="50%"
              bgcolor={color}
              onClick={(e) => handleCopyText(e, color)}
            />
            <Typography variant="caption" onClick={(e) => handleCopyText(e, color)}>
              {color}
            </Typography>
            <Typography variant="caption" onClick={(e) => handleCopyText(e, hexColors[i])}>
              {hexColors[i]}
            </Typography>
          </Box>
        ))}
      </Box>

      <ToastContainer />
    </Box>
  );
}
