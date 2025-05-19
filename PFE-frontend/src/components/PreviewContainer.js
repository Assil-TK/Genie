import React from "react";
import { createElementFromJson } from "../utils/renderUtils";
import { Box } from "@mui/material";

const PreviewContainer = ({generatedJson}) => {
    return (
        <Box sx={{margin: 20}}>
            {generatedJson && generatedJson.map((el, idx) => createElementFromJson(el, idx))}
        </Box>
    );
};
export default PreviewContainer;