import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, getPopMovies, getTopMovies, IGetMovies } from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Row = styled(motion.div)`
  padding: 0px 30px;
  display: grid;
  gap: 5px;
  position: absolute;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
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

const rowVariants = {
  hidden: { x: window.outerWidth },
  visible: { x: 0 },
  exit: { x: -window.outerWidth },
};

export const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.4, duration: 0.3 },
  },
};

export const infoVariants = {
  hover: { opacity: 1, transition: { delay: 0.4, duration: 0.3 } },
};

const Wrapper = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  height: 170vh;
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
  padding: 50px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.7);
`;

const Title = styled.h2`
  font-size: 60px;
  width: 35%;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  font-size: 16px;
  font-weight: 500;
  width: 30%;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  top: -50px;
`;

const Slider = styled.div`
  padding: 35px 0px;
  height: 170px;
  margin-bottom: 20px;
`;

const SliderTitle = styled.div`
  padding-left: 35px;
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 18px;
  text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.7);
`;

export const Overlay = styled(motion.div)`
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

export const Rarr = styled(motion.span)`
  color: ${(props) => props.theme.white.darker};
  position: relative;
  right: 30px;
  font-size: 20px;
  cursor: pointer;
`;

export const Div = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const rarrVariants = {
  start: { opacity: 0.6 },
  hover: { opacity: 1, scale: 1.2 },
};

const offset = 5;

function Home() {
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { data: nowData, isLoading: nowLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: popData, isLoading: popLoading } = useQuery<IGetMovies>(
    ["movies", "popular"],
    getPopMovies
  );
  const { data: topData, isLoading: topLoading } = useQuery<IGetMovies>(
    ["movies", "top"],
    getTopMovies
  );
  const [popIndex, setPopIndex] = useState(0);
  const [nowIndex, setNowIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incrIndex = (indexType: string) => {
    if (nowData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      if (indexType === "popIndex") {
        setPopIndex((index) => (index === maxIndex ? 0 : popIndex + 1));
      }
      if (indexType === "nowIndex") {
        setNowIndex((index) => (index === maxIndex ? 0 : nowIndex + 1));
      }
      if (indexType === "topIndex") {
        setTopIndex((index) => (index === maxIndex ? 0 : topIndex + 1));
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const clickedMovie =
    (bigMovieMatch?.params.movieId &&
      nowData?.results.find(
        (obj) => obj.id === +bigMovieMatch?.params.movieId!
      )) ||
    (bigMovieMatch?.params.movieId &&
      popData?.results.find(
        (obj) => obj.id === +bigMovieMatch?.params.movieId!
      )) ||
    (bigMovieMatch?.params.movieId &&
      topData?.results.find(
        (obj) => obj.id === +bigMovieMatch?.params.movieId!
      ));
  const onClickOverlay = () => {
    navigate(-1);
  };
  const wholeOV = topData?.results[3].overview;
  const OV = wholeOV?.substring(0, wholeOV.length / 3.2);
  return (
    <Wrapper>
      {nowLoading || popLoading || topLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(topData?.results[3].backdrop_path!)}>
            <Title>{topData?.results[3].title}</Title>
            <Overview>{wholeOV?.length! > 100 ? OV : wholeOV}</Overview>
          </Banner>
          <SliderWrapper>
            <Slider>
              <Div>
                <SliderTitle>지금 상영 중인 영화</SliderTitle>
                <Rarr
                  onClick={() => incrIndex("nowIndex")}
                  variants={rarrVariants}
                  initial="start"
                  whileHover="hover"
                >
                  ▶
                </Rarr>
              </Div>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  transition={{ type: "tween", duration: 1.5 }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={nowIndex}
                >
                  {nowData?.results
                    .slice(1)
                    .slice(offset * nowIndex, offset * nowIndex + offset)
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
            <Slider>
              <Div>
                <SliderTitle>지금 뜨는 콘텐츠</SliderTitle>
                <Rarr
                  onClick={() => incrIndex("popIndex")}
                  variants={rarrVariants}
                  initial="start"
                  whileHover="hover"
                >
                  ▶
                </Rarr>
              </Div>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  transition={{ type: "tween", duration: 1.5 }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={popIndex}
                >
                  {popData?.results
                    .slice(1)
                    .slice(offset * popIndex, offset * popIndex + offset)
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
            <Slider>
              <Div>
                <SliderTitle>높은 등급을 받은 영화</SliderTitle>
                <Rarr
                  onClick={() => incrIndex("topIndex")}
                  variants={rarrVariants}
                  initial="start"
                  whileHover="hover"
                >
                  ▶
                </Rarr>
              </Div>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  transition={{ type: "tween", duration: 1.5 }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={topIndex}
                >
                  {topData?.results
                    .slice(1)
                    .slice(offset * topIndex, offset * topIndex + offset)
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
          </SliderWrapper>
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
