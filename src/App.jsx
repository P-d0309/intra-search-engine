import { Box, Container, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Link, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const handleClick = () => {
    setSearchResults([]);
    setSearch(searchValue);
  }

  useEffect(() => {
    if (search) {
      setIsLoading(true);
      getData()};
  }, [search]);
  const getData = async () => {
    let dataArray = []
    const productsData = await axios.get(
      `https://makeup-api.herokuapp.com/api/v1/products.json?brand=${search}`
    );

    if (productsData.data.length > 0) {
      productsData.data.forEach((productData) => {
        dataArray.push({
          description: productData.description,
          url: productData.product_link,
        });
      });
    }

    const unisData = await axios.get(
      `http://universities.hipolabs.com/search?country=${search}`
    );
    
    if (unisData.data.length > 0) {
      unisData.data.forEach((uniData) => {
        dataArray.push({
          description: uniData.name,
          url: uniData.domains[0],
        });
      });
    }

    const showsData = await axios.get(
      `https://api.tvmaze.com/search/shows?q=${search}`
    );

    if (showsData.data.length > 0) {
      showsData.data.forEach((showData) => {
        dataArray.push({
          description: showData.show.summary,
          url: showData.show.url,
        });
      });
    }

    const citiesData = await axios.get(
      `https://nominatim.openstreetmap.org/search.php?city=${search}&format=jsonv2`
    );
    
    if (citiesData.data.length > 0) {
      citiesData.data.forEach((cityData) => {
        dataArray.push({
          description: cityData.display_name,
          url: cityData.icon,
        });
      });
    }
    setSearchResults(dataArray);
    setIsLoading(false);
  };
  const handleChange = (e) => {
    setSearchValue(e.target.value);
  }
  return (
    <Box minHeight={"100vh"}>
      <Container fixed sx={!search ? { minHeight: "100vh" } : ""}>
        <Grid
          container
          sx={!search ? { minHeight: "100vh" } : ""}
          alignContent={"center"}
        >
          <Grid item xs={12}>
            <FormControl fullWidth variant={"standard"}>
              <InputLabel htmlFor="outlined-adornment-amount">
                Enter the search term
              </InputLabel>
              <Input
                value={searchValue}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={handleClick}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
        {search && (
          <Grid container>
            {
              isLoading && [...Array(10)].map((v,i) => {
                return (
                  <Grid item sm={12}>
                    <Box m={1.5}>
                      <Skeleton width={"50%"}></Skeleton>
                      <Skeleton></Skeleton>
                    </Box>
                  </Grid>
                );
              })
            }
            {searchResults.map((result) => {
              return (
                <Grid item sm={12}>
                  <Box m={1.5}>
                    <Link href={result.url}>
                      <Typography variant="h5">{result.url}</Typography>
                    </Link>
                    <Typography
                      variant="body2"
                      dangerouslySetInnerHTML={{
                        __html: result.description,
                      }}
                    >
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;