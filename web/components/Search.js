import React, { useState } from "react";
import Input from "./Input";
import Picker from "./Picker";
import SearchItem from "./SearchItem";

function Search() {
  const [term, setTerm] = useState("");
  const [site, setSite] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});

  const search = async e => {
    if (e) e.preventDefault();
    setLoading(true);

    if (term !== "") {
      const res = await fetch("/api/v1/search/" + site + "?query=" + term);
      if (res.status !== 200) {
        setResponse({
          error: true,
          errorMessage: "Cannot connect to site"
        });
      } else {
        const response = await res.json();
        setResponse(response);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <h1>Search</h1>
      <form onSubmit={search}>
        <Picker
          id="site"
          name="site"
          label="Select site"
          value={site}
          onChange={setSite}
          options={[
            { name: "1337x", value: "1337x" },
            { name: "Limetorrents", value: "limetorrent" },
            { name: "Piratebay", value: "piratebay" }
          ]}
          required
        />
        <Input
          id="term"
          name="term"
          label="Search Term"
          placeholder="The forgotten army, Flames..."
          value={term}
          onChange={setTerm}
          required
        />
        <button disabled={loading} className={`btn primary${loading ? " loading" : ""}`} type="submit">
          Search
        </button>
      </form>
      <div className="d-flex-column mv-1">
        {response.error && <div className="text-danger">{response.errorMessage}</div>}
        {response.results &&
          response.results.length > 0 &&
          response.results.map(result => <SearchItem site={site} result={result} key={result.link} />)}
      </div>
    </>
  );
}

export default Search;
