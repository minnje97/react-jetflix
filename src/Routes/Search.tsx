import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import {
  Navigate,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import { multiSearch } from "../api";
import { makeImagePath } from "../utils";
import { boxVariants, infoVariants, Overlay } from "./Home";

type media = "movie" | "tv";

interface ISearch {
  page: number;
  results: ISearchResults[];
  total_pages: number;
  total_results: number;
}

interface ISearchResults {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string | null;
  title: string | null;
  overview: string;
  media_type: media;
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 130px 50px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
`;

const Box = styled(motion.div)<{ sliderPhoto: string }>`
  background-color: white;
  height: 130px;
  border-radius: 3px;
  background-image: radial-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3)),
    url(${(props) => props.sliderPhoto});
  background-size: cover;
  background-position: center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding: 7px;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 12px;
  }
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 80vh;
  left: 0;
  right: 0;
  border-radius: 15px;
  overflow: hidden;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  background: linear-gradient(black, rgba(0, 0, 0, 0.8));
`;

const BigCover = styled.img`
  width: 100%;
  height: 70%;
`;

const BigTitle = styled.h2`
  padding: 10px;
  font-size: 22px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigOverview = styled.p`
  font-size: 12px;
  padding: 5px;
`;

function Search() {
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const [searchParams, _] = useSearchParams();
  const bigSearchMatch = useMatch("/search/:resultId");
  const keyword = searchParams.get("keyword");
  const { data, isLoading } = useQuery<ISearch>(["search"], () =>
    multiSearch({ keyword })
  );
  console.log(data, isLoading);
  const onBoxClicked = (resultId: number) => {
    navigate(`/search/${resultId}`);
  };
  const clickedBox =
    bigSearchMatch?.params.resultId &&
    data?.results.find((obj) => obj.id === +bigSearchMatch.params.resultId!);
  const onClickOverlay = () => {
    navigate(-1);
  };
  return (
    <Wrapper>
      <Grid>
        {data?.results.map((result) => (
          <Box
            key={result.id}
            sliderPhoto={makeImagePath(result.backdrop_path, "w500")}
            variants={boxVariants}
            initial="normal"
            whileHover="hover"
            transition={{ type: "tween" }}
            onClick={() => onBoxClicked(result.id)}
            layoutId={result.id + ""}
          >
            <Info variants={infoVariants}>
              <h4>{result.title || result.name}</h4>
            </Info>
          </Box>
        ))}
      </Grid>
      <AnimatePresence>
        {bigSearchMatch ? (
          <>
            <Overlay
              onClick={onClickOverlay}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={bigSearchMatch.params.resultId}
              style={{
                top: scrollY.get() + 60,
              }}
            >
              {clickedBox && (
                <>
                  <BigCover
                    src={makeImagePath(clickedBox.backdrop_path, "w500")}
                  />
                  <BigTitle>{clickedBox.title || clickedBox.name}</BigTitle>
                  <BigOverview>{clickedBox.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}
export default Search;
