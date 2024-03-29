import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useMatch, PathMatch, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  display: flex;
  z-index: 98;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.8), 50%, rgba(0, 0, 0, 0));
  position: fixed;
  top: 0px;
  width: 100%;
  height: 70px;
  padding: 20px 60px;
  color: white;
  font-size: 14px;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 2px;
    stroke: white;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
    font-weight: 600;
  }
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  top: 22px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.red};
`;

const Search = styled.form`
  display: flex;
  align-items: center;
  color: white;
  svg {
    height: 22px;
  }
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [1, 0.4, 0, 0.7, 0, 1],
    duration: 3,
  },
};

const Input = styled(motion.input)`
  transform-origin: right center;
  padding: 8px 10px;
  padding-left: 33px;
  color: white;
  font-size: 13px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const navVariants = {
  top: { backgroundColor: "rgba(0,0,0,0)" },
  scroll: { backgroundColor: "rgba(0,0,0,1)" },
};

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch: PathMatch<string> | null = useMatch("/");
  const tvMatch: PathMatch<string> | null = useMatch("tv");
  const inputAnimation = useAnimation();
  const scrollAnimation = useAnimation();
  const { scrollY } = useViewportScroll();
  const { register, handleSubmit } = useForm<IForm>();
  const navigate = useNavigate();
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 70) {
        scrollAnimation.start("scroll");
      } else {
        scrollAnimation.start("top");
      }
    });
  }, [scrollY, scrollAnimation]);
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((prev) => !prev);
  };
  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
  };
  return (
    <Nav variants={navVariants} initial="top" animate={scrollAnimation}>
      <Col>
        <Link to="/">
          <Logo
            variants={logoVariants}
            initial="normal"
            whileHover="active"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
          >
            <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
          </Logo>
        </Link>
        <Items>
          <Item>
            <Link to="/">영화</Link>
            {homeMatch && <Circle layoutId="circle" />}
          </Item>
          <Item>
            <Link to="/tv">TV 프로그램</Link>
            {tvMatch && <Circle layoutId="circle" />}
          </Item>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: "linear" }}
            placeholder="한국어로 제목 또는 사람"
          />
          <motion.svg
            onClick={toggleSearch}
            transition={{ type: "linear" }}
            style={{ cursor: "pointer" }}
            animate={{ x: searchOpen ? -200 : 0 }}
            whileTap={{ scale: 1.2 }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
