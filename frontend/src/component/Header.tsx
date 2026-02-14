import { Box, Grid, Typography } from "@mui/material";
import Link from "next/link";



export function Header() {
  
  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        px: { xs: 2, sm: 4, md: 8 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        "@keyframes gradientBG": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#111",
          mb: { xs: 1, sm: 0 },
          cursor:'pointer'
        }}
        // onClick={()=>router.push('/')}
      >
        <Link href={'/'}>ColorPalette</Link>
      </Typography>

      <Grid container spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
        <Grid item>
          <Link href="/" passHref prefetch>
            <Typography
              sx={{
                color: "#111",

                fontWeight: 500,
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: "#55ffbb",
                "&:hover": { transform: "scale(1.05)" },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Home
            </Typography>
          </Link>
        </Grid>

        <Grid item>
          <Link href="/favorite-color" passHref>
            <Typography
              sx={{
                color: "#111",

                fontWeight: 500,
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: "#55ffbb",
                "&:hover": { transform: "scale(1.05)" },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Your Collection
            </Typography>
          </Link>
        </Grid>

         <Grid item>
          <Link href="/custom-color" passHref>
            <Typography
              sx={{
                color: "#111",

                fontWeight: 500,
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: "#55ffbb",
                "&:hover": { transform: "scale(1.05)" },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Custom
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
