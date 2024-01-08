import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";

const CLIENT_ID = "6d89bc15e2b742208dcc33ffaa424dcf";
const CLIENT_SECRET = "2b8cd02a7a244234bd98ddf2b8944a6d";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [artistGenre, setArtistGenre] = useState("");
  const [artistName, setArtistName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  async function search() {
    let searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    let artistId = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArtistName(data.artists.items[0].name);
        setArtistGenre(data.artists.items[0].genres[0]);
        return data.artists.items[0].id;
      });

    let returnedAlbums = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=BR&limit=50`,
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        setAlbums(data.items);
      });
  }
  return (
    <div>
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Pesquise um artista"
            type="input"
            onKeyPress={(e) => {
              if (e.key == "Enter") {
                search();
              }
            }}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button onClick={search}>Pesquisar</Button>
        </InputGroup>
      </Container>

      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mb-3">
            <h2 className="display-4">{artistName}</h2>
            <h5 className="text-muted">{artistGenre}</h5>
          </div>
        </div>
      </div>

      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album) => {
            return (
              <Card key={album.id}>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>
                    <a
                      className="text-decoration-none text-reset"
                      href={album.external_urls.spotify}
                    >
                      {album.name}
                    </a>
                  </Card.Title>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
