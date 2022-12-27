import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Select, MenuItem, Box, Grid, Button, Chip } from "@mui/material";

function Form({ setFilter, filter, setUseId, useId }) {
  let [option, setOption] = useState("title");
  let [valueText, setText] = useState("");

  const resetClick = ()=>{
    setFilter({
        id: null,
        title: null,
        "album.title": null,
        "album.user.email": null,
      })
      setUseId(false)
  }

  const handleDelete = (event)=>{
    if(option === "id" ) setUseId(false) //hides the message and allows other filters to be applied
    filter[event] = null;
    setFilter({ ...filter });
  }

  const handleClick = (event) => {
    if(option === "id" ) setUseId(true) //if the id was selected, display the message indicating the search by id, it does not affect the rest of the filters
    if(!useId){
        filter[option] = valueText;//Modify the value of the filter based on the option that was selected
        setFilter({ ...filter });
    }    
  };

  const handleChange = (event) => {
    setOption(event.target.value);
  };

  let options = ["title", "album.title", "album.user.email","id"]; //key to know the filter that was applied
  return (
    <>
      <Grid container spacing={0.5} alignItems="center" justifyItems="center" textAlign="center">
        <Grid item md={4} sm={12}>
            <TextField 
            style={{width:"100%"}}
            id="outlined-basic"
            label="Search"
            onChange={(e) => setText(e.target.value)}
            />
        </Grid>
        <Grid item md={4} sm={12}>
            <Select 
            style={{width:"100%"}}
            labelId="filter"
            id="filters"
            value={option}
            size="medium"
            onChange={handleChange}
            >
            {options.map((option) => (
                <MenuItem value={option}>{option}</MenuItem>
            ))}
            </Select>
        </Grid>
        <Grid item md={4} sm={12} spacing={0.5} justifyContent="space-evenly" display="flex" >
            <Button  color="primary" onClick={handleClick} variant="contained">
            Apply Filter
            </Button>
            <Button  color="error" onClick={resetClick} variant="contained">
            Reset Filter
            </Button>
        </Grid>
      </Grid>
      <Box justifyContent="center" alignItems="center" display="flex" mt={2} >
        {options.map((e) => {
             if (filter[e] && filter[e].length > 0)
             return <Chip sx={{mr:1}}  color="primary" key={e} label={`${e}=${filter[e]}`} variant="outlined" onDelete={handleDelete.bind(this, e)}/>;  
        })}
      </Box>
    </>
  );
}

export default Form;
