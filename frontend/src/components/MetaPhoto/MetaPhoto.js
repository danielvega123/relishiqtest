import axios from "axios";
import PhotoAlbum from "react-photo-album";
import Form from "../Form/Form";
import { useState, useCallback, useEffect } from "react";
import { Box, TablePagination } from "@mui/material";

function MetaPhoto() {
  let [filter, setFilter] = useState({
    title: null,
    "album.title": null,
    "album.user.email": null,
  });
  let [photos, setPhotos] = useState([]);
  let [id_photo, setId_photo] = useState("");
  let [offset, setOffset] = useState(0);
  let [limit, setLimit] = useState(25);  
  let [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(2);


  useEffect(() => {
    try {
      var filter_str = "?";
      if (filter["title"] && filter["title"].length > 0)
        filter_str += `title=${filter["title"]}`;
      if (filter["album.title"] && filter["album.title"].length > 0)
        filter_str += `&album.title=${filter["album.title"]}`;
      if (filter["album.user.email"] && filter["album.user.email"].length > 0)
        filter_str += `&album.user.email=${filter["album.user.email"]}`;
        filter_str += `&limit=${limit}&offset=${offset}`
      setId_photo(filter_str);
    } catch (error) {
      console.log(error);
      setId_photo("");
    }
  }, [filter, offset,limit]);

  const getPhotos = useCallback(async () => {
    const response = await axios.get(
      "http://localhost:5000/externalapi/photos" + (!id_photo ? "" : id_photo)
    );
    console.log(response);
    const body = response.data;
    if (response.status === 200) {        
        setTotalItems(body.length)
        setPhotos(body);
    }
    else setPhotos([]);
  }, [id_photo]);

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
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  return (
    <>
      <Box m={4}>
        <Form setFilter={setFilter} filter={filter}></Form>
      </Box>
      <Box m={4}>
        {photos.length === 0 ? (
          <p>Sorry, the list is empty.</p>
        ) : (
          <PhotoAlbum
            layout="rows"
            photos={photos.map((photo) => ({
              src: photo.thumbnailUrl,
              width: 100,
              height: 100,
            }))}
          />
        )}
        <TablePagination
            component="div"
            count={totalItems}
            page={offset}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
      </Box>
     
    </>
  );
}
export default MetaPhoto;
