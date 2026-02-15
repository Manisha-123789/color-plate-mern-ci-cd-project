"use client";
import { Box, Button, Grid} from "@mui/material";
import { useEffect, useState } from "react";
import { MuiColorInput } from "mui-color-input";
import { v4 as uuidv4 } from "uuid";
import { useApi } from '@/hooks/useApi';
import { apiCall } from '../../../utils/apiCall';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

interface Palette {
  colors: string[];
  wishlist: true;
}

export function CustomColor() {
  const [colors, setColors] = useState<Palette[]>([
    {
      colors: ["#1f2041", "#4B3F72", "#417B5A", "#d0ceba", "#E9D2C0"],
      wishlist: true
    },
  ]);
  const [saveThisPalette, setSaveThisPalette] = useState();
  // console.log(saveThisPalette, 'saveThisPalette')
   const {data, loading, error} = useApi(`POST` ,`${process.env.NEXT_PUBLIC_BASE_URI}color-palette/`, {
"colors": [
"rgba(105,150,227,0.2)",
"rgba(105,150,227,0.4)",
"rgba(105,150,227,0.6)",
"rgba(105,150,227,0.8)",
"rgba(105,150,227,1)"
]})
   console.log(data, loading, error, 'custom')

  const handleColorPicker = (newValue: string, paletteIndex: number, colorIndex: number) => {
    setColors((prev) =>
      prev.map((palette, pIndex) =>
        pIndex === paletteIndex
          ? {
              ...palette,
              colors: palette.colors.map((color, cIndex) =>
                cIndex === colorIndex ? newValue : color
              ),
            }
          : palette
      )
    );
  };

  const handleSaveYourCustomPalette  = async () => {
    const customColor = colors[0];
  const res = await  apiCall('POST', `${process.env.NEXT_PUBLIC_BASE_URI}color-palette/`, customColor)
    if(res.message && res.success){
      toast(res.message)
    }
  };

//   useEffect(()=>{

//  console.log(data, 'data')
//   }, [saveThisPalette])

  return (
    <Box
      width="100%"
      minHeight="80vh"
      p={{ xs: 0, sm: 0, md: 0}}
      bgcolor="gray"
    >
      <Grid container spacing={3} justifyContent="center" flexWrap="wrap">
        {colors.map((palette, paletteIndex) => (
          <Box
            key={palette.id}
            display="flex"
            width="100%"
            height="100%"
            margin={1}
            flexWrap="wrap"
          >
            {palette.colors.map((color, colorIndex) => (
              <Box
                key={colorIndex}
                width="20%"
                height="60vh"
                bgcolor={color}
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out",
                  
                }}
              >
                <MuiColorInput
                  format="hex"
                  value={color}
                  onChange={(newValue) =>
                    handleColorPicker(newValue, paletteIndex, colorIndex)
                  }
                />
               
              </Box>
            ))}
          </Box>
        ))}
        <Button
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "#16678e",
            "&:hover": { bgcolor: "#11506d" },
          }}
          onClick={handleSaveYourCustomPalette}
        >
          SAVE
        </Button>
      </Grid>
      <ToastContainer/>
    </Box>
  );
}
