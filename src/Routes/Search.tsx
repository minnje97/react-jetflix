import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { multiSearch } from "../api";
import { makeImagePath } from "../utils";
import {
  BigCover,
  BigMovie,
  BigOverview,
  BigTitle,
  boxVariants,
  infoVariants,
  Overlay,
} from "./Home";

type media = "movie" | "tv";

interface ISearch {
  page: number;
  results: ISearchResults[];
  total_pages: number;
  total_results: number;
}

interface ISearchResults {
  profile_path: string;
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
  row-gap: 50px;
`;

const Box = styled(motion.div)<{ sliderPhoto: string }>`
  background-color: white;
  height: 130px;
  border-radius: 2px;
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
            sliderPhoto={makeImagePath(
              result.backdrop_path || result.profile_path,
              "w500"
            )}
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
                    CoverImg={makeImagePath(
                      clickedBox.backdrop_path || clickedBox.profile_path
                    )}
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
