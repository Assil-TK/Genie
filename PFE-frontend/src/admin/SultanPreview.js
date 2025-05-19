import { Box, Button, Card, Typography } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { useParams, useNavigate } from "react-router-dom";
import { getPageContent } from "../services/api";
import { createElementFromJson } from "../utils/renderUtils";
import { useState, useEffect } from "react";

const SultanPreview = () => {
    const {pageId} = useParams();
    const navigate = useNavigate();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try{
                const response = await getPageContent(pageId);
                if (response && response.content) {
                    setPageContent(JSON.parse(response.content));
                }
            } catch(error){
                console.error("erreur lors du chargement du contenu de la page: ",error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [pageId]);

    const handleRectifier = () => {
        navigate(`/admin/SultanChatBot/${pageId}`);
    };

    const handleValider = () => {
        console.log("contenu valider ! ");
        navigate("/admin/dashboard");
    };
    return (
        <Box
            sx={{
                p: 10,
                bgcolor: "#f9f9f9",
                height: '600px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Box>
                <Typography variant="h6" align="center" color="#747474">Prévisualisation de l'interface</Typography>
            </Box>
            {/* <Card
                sx={{
                    display: "flex",
                    mt: 2, borderRadius: 2,
                    overFlow: "hidden",
                    border: "1px solid #fff",
                    height: "450px",
                    width: "800px"
                }}>

            </Card> */}
            <Card
        sx={{
          width: "100%",
          maxWidth: "900px",
          height: "500px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
          bgcolor: "#fff",
        }}
      >
        {loading ? (
          <Typography sx={{ m: 2 }}>Chargement...</Typography>
        ) : (
          pageContent ? (
            createElementFromJson(pageContent, "root")
          ) : (
            <Typography color="text.secondary">Pas de contenu disponible.</Typography>
          )
        )}
      </Card>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap:1 }}>
                <Button
                    variant="outlined"
                    onClick={handleRectifier}
                    sx={{
                        backgroundColor: '#F5F5F5',
                        color: '#000',
                        borderColor: '#1B374C',
                        height: '40px',
                        borderRadius: 5,
                        '&:active': {
                            backgroundColor: '#1B374C',
                            color: '#FFF',
                            borderColor: '#1B374C',
                        }
                    }}
                ><span><ClearIcon /></span>Rectifier</Button>
                <Button 
                    variant="contained" 
                    onClick={handleValider}
                    sx={{ 
                        backgroundColor: '#1B374C', 
                        color: '#FFF', 
                        height: '40px', 
                        borderRadius: 5 
                        }}
                >Valider<span><DoneIcon/></span></Button>
            </Box>

        </Box>

    );
};
export default SultanPreview;