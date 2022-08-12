import { useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword");
  console.log(keyword);
  return <h2>search</h2>;
}
export default Search;
