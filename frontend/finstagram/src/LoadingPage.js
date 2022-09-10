import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingPage(props) {
  return (
    <Box sx={{ display: "flex" }} style={{ width: "25vh", margin: "20% auto" }}>
      <CircularProgress
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          margin: "auto auto",
        }}
      />
    </Box>
  );
}
