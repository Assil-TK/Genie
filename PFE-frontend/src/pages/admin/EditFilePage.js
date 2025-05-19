import React, { useEffect, useState } from "react";
import {fetchFileList } from "../../services/api";
import { Box} from "@mui/material";
import PageSelector from "../../components/PageSelector";

const EditFilePage = () => {
  const [files, setFiles] = useState([]);
 
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const fileList = await fetchFileList();
        setFiles(fileList);
      } catch (err) {
        setError(err.message);
      }
    };
    loadFiles();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
        <PageSelector />
    </Box>
  );
};
export default EditFilePage;

