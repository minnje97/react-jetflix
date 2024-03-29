import { useQuery } from "react-query";
import styled from "styled-components";
import { getNowTv, getPopTv, getTopTv, IGetTvs } from "../api";
import { makeImagePath } from "../utils";
import {
  motion,
  AnimatePresence,
  useViewportScroll,
  LayoutGroup,
} from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { BigOverview, BigTitle, Div, Rarr, rarrVariants } from "./Home";

const Row = styled(motion.div)`
  padding: 0px 30px;
  display: grid;
  gap: 5px;
  position: absolute;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
`;

const Box = styled(motion.div)<{ sliderphoto: string }>`
  background-color: white;
  height: 130px;
  border-radius: 3px;
  background-image: radial-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3)),
    url(${(props) => props.sliderphoto});
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

const boxVariants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.4,
    y: -50,
    transition: { delay: 0.4, duration: 0.3 },
  },
};

const infoVariants = {
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  padding-top: 110px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), 60%, rgba(0, 0, 0, 0.9)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  font-size: 60px;
  width: 35%;
  font-weight: 600;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  width: 40%;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  top: -10px;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  cursor: pointer;
`;

const BigTv = styled(motion.div)`
  position: absolute;
  width: 65vw;
  height: 120vh;
  left: 0;
  right: 0;
  border-radius: 15px;
  overflow: hidden;
  margin: 0 auto;
  z-index: 100;
  background-color: rgba(24, 24, 24, 1);
`;

const BigCover = styled.div<{ CoverImg: string }>`
  width: 100%;
  height: 55%;
  background-image: linear-gradient(rgba(0, 0, 0, 0), 80%, rgba(24, 24, 24, 1)),
    url(${(props) => props.CoverImg});
  background-size: cover;
`;

const offset = 5;

function Tv() {
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const bigTvMatch = useMatch("/tv/:tvId");
  const { data: popTvData, isLoading: popTvLoading } = useQuery<IGetTvs>(
    ["tv", "popular"],
    getPopTv
  );
  const { data: topTvData, isLoading: topTvLoading } = useQuery<IGetTvs>(
    ["tv", "top"],
    getTopTv
  );
  const { data: nowTvData, isLoading: nowTvLoading } = useQuery<IGetTvs>(
    ["tv", "now"],
    getNowTv
  );
  const [popTvIndex, setPopTvIndex] = useState(0);
  const [topTvIndex, setTopTvIndex] = useState(0);
  const [nowTvIndex, setNowTvIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incrIndex = (indexType: string) => {
    if (popTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = popTvData?.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      if (indexType === "popTvIndex") {
        setPopTvIndex((index) => (index === maxIndex ? 0 : popTvIndex + 1));
      }
      if (indexType === "topTvIndex") {
        setTopTvIndex((index) => (index === maxIndex ? 0 : topTvIndex + 1));
      }
      if (indexType === "nowTvIndex") {
        setNowTvIndex((index) => (index === maxIndex ? 0 : nowTvIndex + 1));
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };
  const clickedTv =
    (bigTvMatch?.params.tvId &&
      popTvData?.results.find((obj) => obj.id === +bigTvMatch?.params.tvId!)) ||
    (bigTvMatch?.params.tvId &&
      topTvData?.results.find((obj) => obj.id === +bigTvMatch?.params.tvId!)) ||
    (bigTvMatch?.params.tvId &&
      nowTvData?.results.find((obj) => obj.id === +bigTvMatch?.params.tvId!));
  const onClickOverlay = () => {
    navigate(-1);
  };
  const wholeOV = topTvData?.results[0].overview;
  const OV = wholeOV?.substring(0, wholeOV.length);
  return (
    <Wrapper>
      {nowTvLoading || popTvLoading || topTvLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(topTvData?.results[0].backdrop_path!)}>
            <Title>{topTvData?.results[0].name}</Title>
            <Overview>{wholeOV?.length! > 100 ? OV : wholeOV}</Overview>
          </Banner>
          <SliderWrapper>
            <LayoutGroup id="1">
              <Slider>
                <Div>
                  <SliderTitle>지금 뜨는 TV 프로그램</SliderTitle>
                  <Rarr
                    onClick={() => incrIndex("popTvIndex")}
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
                    key={popTvIndex}
                  >
                    {popTvData?.results
                      .slice(offset * popTvIndex, offset * popTvIndex + offset)
                      .map((movie) => (
                        <Box
                          key={movie.id}
                          sliderphoto={makeImagePath(
                            movie.backdrop_path,
                            "w500"
                          )}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          onClick={() => onBoxClicked(movie.id)}
                          layoutId={movie.id + ""}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.name}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            </LayoutGroup>
            <LayoutGroup id="2">
              <Slider>
                <Div>
                  <SliderTitle>좋은 평을 받은 TV 프로그램</SliderTitle>
                  <Rarr
                    onClick={() => incrIndex("topTvIndex")}
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
                    key={topTvIndex}
                  >
                    {topTvData?.results
                      .slice(2)
                      .slice(offset * topTvIndex, offset * topTvIndex + offset)
                      .map((movie) => (
                        <Box
                          key={movie.id}
                          sliderphoto={makeImagePath(
                            movie.backdrop_path,
                            "w500"
                          )}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          onClick={() => onBoxClicked(movie.id)}
                          layoutId={movie.id + ""}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.name}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            </LayoutGroup>
            <LayoutGroup id="3">
              <Slider>
                <Div>
                  <SliderTitle>매주 새로운 에피소드</SliderTitle>
                  <Rarr
                    onClick={() => incrIndex("nowTvIndex")}
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
                    key={nowTvIndex}
                  >
                    {nowTvData?.results
                      .slice(offset * nowTvIndex, offset * nowTvIndex + offset)
                      .map((movie) => (
                        <Box
                          key={movie.id}
                          sliderphoto={makeImagePath(
                            movie.backdrop_path,
                            "w500"
                          )}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          onClick={() => onBoxClicked(movie.id)}
                          layoutId={movie.id + ""}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.name}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            </LayoutGroup>
          </SliderWrapper>
          {["1", "2", "3"].map((key) => (
            <LayoutGroup id={key}>
              <AnimatePresence>
                {bigTvMatch ? (
                  <>
                    <Overlay
                      onClick={onClickOverlay}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                    <BigTv
                      layoutId={bigTvMatch.params.tvId}
                      style={{
                        top: scrollY.get() + 30,
                      }}
                    >
                      {clickedTv && (
                        <>
                          <BigCover
                            CoverImg={makeImagePath(clickedTv.backdrop_path)}
                          />
                          <BigTitle>{clickedTv.name}</BigTitle>
                          <BigOverview>{clickedTv.overview}</BigOverview>
                        </>
                      )}
                    </BigTv>
                  </>
                ) : null}
              </AnimatePresence>
            </LayoutGroup>
          ))}
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
