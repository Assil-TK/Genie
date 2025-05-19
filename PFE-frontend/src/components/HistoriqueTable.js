import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
const historiqueData = [
    {id:1, action: "Creation", date:"01/01/1001"},
    {id:2, action: "Creation", date:"02/01/1001"},
    {id:3, action: "Creation", date:"03/01/1001"},
    {id:4, action: "Modification", date:"04/01/1001"},
];
const HistoriqueTable = () =>(
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {historiqueData.map((item) =>(
                    <TableRow key={item.id}>
                        <TableCell>{item.action}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                            <IconButton><SearchIcon/></IconButton>
                            <IconButton><DeleteIcon/></IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default HistoriqueTable;