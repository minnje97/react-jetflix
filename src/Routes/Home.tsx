import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  height: 200vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  background-color: #487eb0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 45px;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  font-size: 17px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -150px;
`;

const Row = styled(motion.div)`
  display: grid;
  position: absolute;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
`;

const Box = styled(motion.div)<{ sliderPhoto: string }>`
  background-color: white;
  height: 120px;
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

const rowVariants = {
  hidden: { x: window.outerWidth - 10 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth + 10 },
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
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

const offset = 6;

const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.4, duration: 0.3 },
  },
};

const infoVariants = {
  hover: { opacity: 1, transition: { delay: 0.4, duration: 0.3 } },
};

function Home() {
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incrIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((index) => (index === maxIndex ? 0 : index + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((obj) => obj.id === +bigMovieMatch?.params.movieId!);
  console.log(clickedMovie);
  const onClickOverlay = () => {
    navigate(-1);
  };
  const wholeOV = data?.results[0].overview;
  const OV = wholeOV?.substring(0, wholeOV.length - 100);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incrIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path!)}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{wholeOV?.length! > 200 ? OV + "..." : wholeOV}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                transition={{ type: "tween", duration: 1.5 }}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      sliderPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                      layoutId={movie.id + ""}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onClickOverlay}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{
                    top: scrollY.get() + 60,
                  }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        src={makeImagePath(clickedMovie.backdrop_path, "w500")}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
