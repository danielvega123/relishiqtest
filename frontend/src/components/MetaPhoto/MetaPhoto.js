import axios from "axios";
import PhotoAlbum from "react-photo-album";
import Form from "../Form/Form";
import { useState, useCallback, useEffect } from "react";
import { Box, TablePagination, Slider } from "@mui/material";

function MetaPhoto() {
  let [filter, setFilter] = useState({
    id: null,
    title: null,
    "album.title": null,
    "album.user.email": null,
  });
  let [useId,setUseId] = useState(false) // check if the search is by filter or by id
  let [photos, setPhotos] = useState([]);
  let [id_photo, setId_photo] = useState("");
  let [offset, setOffset] = useState(0);
  let [limit, setLimit] = useState(25);  
  let [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(10); // Managed the amount of imagep er page


  useEffect(() => {
    try {
        var filter_str = ""
      if(useId){
        filter_str = `/${filter["id"]}`
        setId_photo(filter_str); //If the search is by id, just add to the final string
      } else{
        filter_str = "?";
        if (filter["title"] && filter["title"].length > 0)
          filter_str += `title=${filter["title"]}`;
        if (filter["album.title"] && filter["album.title"].length > 0)
          filter_str += `&album.title=${filter["album.title"]}`;
        if (filter["album.user.email"] && filter["album.user.email"].length > 0)
          filter_str += `&album.user.email=${filter["album.user.email"]}`;
          filter_str += `&limit=${limit}&offset=${offset*page}`
        setId_photo(filter_str); //if had a filter, create the string to add to the final string
      } 
      
    } catch (error) {
      console.log(error);
      setId_photo("");
    }
  }, [filter, offset,limit, useId,page]);

  const getPhotos = useCallback(async () => {
    const response = await axios.get(
      "http://localhost:5000/externalapi/photos" + (!id_photo ? "" : id_photo)
    );
    console.log(response);
    let body = response.data;
    if (response.status === 200) {     
        setTotalItems(body.length)          
        body = body.slice(0,page) 
        setPhotos(body);
    }
    else setPhotos([]);
  }, [id_photo, page]);

  useEffect(() => {
    (async () => {
      try {
        await getPhotos();
      } catch (error) {
        setPhotos([]);
      }
    })();
  }, [getPhotos]);

  const handleChangePage = (event, newPage) => {
    setOffset(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(parseInt(event.target.value));
  };

  const handleLimitChange = (event,newValue) => {
    setLimit(parseInt(newValue));
  };

  const renderPhoto = ({ layout, layoutOptions, imageProps: { alt, id, style, ...restImageProps } }) => (
    
    <div
        style={{
            border: "2px solid #eee",
            borderRadius: "4px",
            boxSizing: "content-box",
            alignItems: "center",
            font: "0.75em",
            width: style?.width,
            padding: `${layoutOptions.padding - 2}px`,
            paddingBottom: 0,
        }}
    >
        <img alt="" style={{ ...style, width: "100%", padding: 0 }} {...restImageProps} />
        <table>
         {alt}
        </table>
        <div
            style={{
                paddingTop: "8px",
                paddingBottom: "8px",
                overflow: "visible",
                whiteSpace: "nowrap",
                textAlign: "center",
            }}
        >
        </div>
    </div>
);

function valuetext(value) {
    return `${value}°C`;
  }

  return (
    <>
      <Box m={4}>
        <Form setFilter={setFilter} filter={filter} setUseId={setUseId} useId={useId}></Form>    
        <p>Records:</p>
      <Slider
            aria-label="Temperature"
            defaultValue={25}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={25}
            marks
            min={25}
            max={500}
            onChange = {handleLimitChange}
        />  
      </Box>
      
      <Box m={4}>
        {useId ? (<p>If you want to apply more filters, remove the "id" filter</p>) : (<p></p>)}
        {photos.length === 0 ? (
          <p>Sorry, the list is empty.</p>
        ) : (
          <PhotoAlbum
            layout="rows"
            photos={photos.map((photo) => ({
                alt: `
                id: ${photo.id}
                Title: ${photo.title},
                Album: ${photo.album.title},
                User: ${photo.album.user.email}
            `,
              src: photo.thumbnailUrl,
              width: 100,
              height: 100,
            }))}
            renderPhoto={renderPhoto}
          />
          
        )}
        <TablePagination
            component="div"
            count={totalItems}
            page={offset}
            onPageChange={handleChangePage}
            rowsPerPage={page}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
      </Box>
     
    </>
  );
}
export default MetaPhoto;
